import OrderCart from '@/components/order-cart'
import { fetchOrders } from '@/lib/orders/api'
import React from 'react'

export default async function OrdersPage() {
    const orders = await fetchOrders()
    console.log(orders)
    return (
        <div className='space-y-6'>
            {orders.map((order) => (
                <OrderCart key={order.id} order={order} />
            ))}
        </div>
    )
}
