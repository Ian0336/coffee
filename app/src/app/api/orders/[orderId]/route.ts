import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;
    const { status } = await request.json();

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        completedAt: status === 'completed' ? new Date() : null
      },
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      }
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;
    
    // 使用 transaction 確保原子性操作
    await prisma.$transaction([
      // 先刪除關聯的 order items
      prisma.orderItem.deleteMany({
        where: { orderId }
      }),
      // 再刪除訂單本身
      prisma.order.delete({
        where: { id: orderId }
      })
    ]);

    return NextResponse.json({ message: 'Order deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete order error:', error);
    return NextResponse.json(
      { message: 'Failed to delete order' },
      { status: 500 }
    );
  }
}