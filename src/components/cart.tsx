"use client"

import { useCart } from "@/hooks/cart/useCart"

export default function Cart() {
    const { carts } = useCart()
    console.log(carts)

    return (
        <div>
        カート
        </div>
    )
}
