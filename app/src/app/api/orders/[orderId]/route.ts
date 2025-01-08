import { NextResponse } from 'next/server';
import { mockOrders } from '../../_mock/orders';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    
    const { orderId } = await context.params;
    const { status } = await request.json();
    console.log('orderId', orderId)
    console.log('mockOrders', mockOrders)
    const orderIndex = mockOrders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      status,
      completedAt: status === 'completed' ? new Date().toISOString() : undefined
    };

    return NextResponse.json(mockOrders[orderIndex], { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
