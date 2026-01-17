import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import Image from 'next/image'
import { Order } from '@/types'
import { Button } from './ui/button'
import Link from 'next/link'

interface OrderCartProps {
    order: Order,
}

export default function OrderCart({ order }: OrderCartProps) {
    return (
        <div>
            <Card className='w-full max-x-3xl mx-auto'>
                <CardHeader className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <div className='relative size-16 rounded-full overflow-hidden flex-none'>
                            <Image
                                src={order.photoUrl}
                                alt={order.restaurantName}
                                fill
                                className='object-cover w-full h-full'
                                sizes='64px'
                            />
                        </div>
                        <div>
                            <CardDescription>{new Date(order.created_at).toLocaleDateString()}</CardDescription>
                            <CardTitle>{order.restaurantName}</CardTitle>
                        </div>
                    </div>
                    <Button asChild variant="outline">
                        <Link href={`/restaurant/${order.restaurant_id}`}>店舗情報を表示</Link>
                    </Button>
                </CardHeader>
                <CardContent className='space-y-4'>
                    {order.order_items.map((item) => (
                        <div key={item.id} className='flex items-center justify-between border-b pb-4 last:border-b-0'>
                            <div className='flex itemse-center gap-4'>
                                <div className='relative size-16 rounded-2xl overflow-hidden flex-none'>
                                    <Image 
                                        src={item.photoUrl}
                                        alt={item.name}
                                        fill
                                        className='object-cover w-full h-full'
                                        sizes='64px'
                                    />
                                </div>
                                <div>
                                    <div className='font-medium'>{item.name}</div>
                                    <div className='text-muted-foreground'>￥{item.price.toLocaleString()}</div>
                                </div>
                            </div>
                            <div className='text-right'>
                                <div>{item.quantity}個</div>
                                <div>￥{(item.quantity * item.price).toLocaleString()}</div>
                            </div>
                        </div>
                    ))}
                </CardContent>
                <CardFooter className='flex flex-col gap-1'>
                    <div className='w-full bordre-t pt-4 space-y-1 text-sm text-muted-foreground'>
                        <div className='flex justify-between'>
                            <span>小計</span>
                            <span>￥{order.subtotal_price.toLocaleString()}</span>
                        </div>
                        {order.fee > 0 && (
                            <div className='flex justify-between'>
                                <span>手数料</span>
                                <span>￥{order.fee.toLocaleString()}</span>
                            </div>
                        )}
                        {order.delivery > 0 && (
                            <div className='flex justify-between'>
                                <span>配達料</span>
                                <span>￥{order.delivery.toLocaleString()}</span>
                            </div>
                        )}
                        {order.service > 0 && (
                            <div className='flex justify-between'>
                                <span>サービス</span>
                                <span>￥{order.service.toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                    <div className='flex justify-between w-full font-bold pt-2'>
                        <span>合計</span>
                        <span>￥{order.total_price.toLocaleString()}</span>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
