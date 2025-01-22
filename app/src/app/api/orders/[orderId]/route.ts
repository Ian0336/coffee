import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth'

export async function PATCH(
  request: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;
    const { status, sessionKey } = await request.json();

    // 驗證管理員權限
    if (!await verifyAdminSession(sessionKey)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

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
  } catch (error: any) {
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
    const { sessionKey } = await request.json();

    // 驗證管理員權限
    if (!await verifyAdminSession(sessionKey)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    await prisma.$transaction([
      prisma.orderItem.deleteMany({
        where: { orderId }
      }),
      prisma.order.delete({
        where: { id: orderId }
      })
    ]);

    return NextResponse.json({ message: 'Order deleted' }, { status: 200 });
  } catch (error: any) {
    console.error('Delete order error:', error);
    return NextResponse.json(
      { message: 'Failed to delete order' },
      { status: 500 }
    );
  }
}