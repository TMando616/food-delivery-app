import OrderCart from '@/components/order-cart'
import { fetchOrders } from '@/lib/orders/api'
import React from 'react'

export default async function OrdersPage() {
    const orders = await fetchOrders()

    if(orders.length === 0) {
        return <div>過去の注文履歴がありません</div>
    }
    return (
        <div className='space-y-6'>
            {orders.map((order) => (
                <OrderCart key={order.id} order={order} />
            ))}
        </div>
    )
}
