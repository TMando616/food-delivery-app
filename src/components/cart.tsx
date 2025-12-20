"use client"

import { useCart } from "@/hooks/cart/useCart"
import { computeCartDisplayLogic } from "@/lib/cart/utils"

export default function Cart() {
    const { carts } = useCart()
    console.log(carts)

    computeCartDisplayLogic(carts)

    return (
        <div>
        カート
        </div>
    )
}
