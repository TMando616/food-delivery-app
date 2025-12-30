"use client"

import { useCart } from "@/hooks/cart/useCart"
import { computeCartDisplayLogic } from "@/lib/cart/utils"
import CartSheet from "./cart-sheet"
import CartDropDown from "./cart-drop-down"
import { useState } from "react"
import type { Cart } from "@/types"

export default function Cart() {
    const [ selectedCart, setSelectedCart ] = useState<Cart | null>(null)
    const { carts, isLoading, cartsError } = useCart()
    console.log(carts)

    const { 
        displayMode, 
        sheetCart, 
        cartCount 
    } = computeCartDisplayLogic(carts, selectedCart)

    if(cartsError) {
        return <div>{cartsError.message}</div>
    }
    if(isLoading || !carts) {
        return <div>loading</div>
    }

    return displayMode === "cartSheet" ? (
        <CartSheet cart={sheetCart} count={cartCount}/>
    ) : (
        <CartDropDown carts={carts} setSelectedCart={setSelectedCart}/>
    )
}
