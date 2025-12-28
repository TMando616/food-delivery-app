"use client"

import { useCart } from "@/hooks/cart/useCart"
import { computeCartDisplayLogic } from "@/lib/cart/utils"
import CartSheet from "./cart-sheet"
import CartDropDown from "./cart-drop-down"

export default function Cart() {
    const { carts, isLoading, cartsError } = useCart()
    console.log(carts)

    const { 
        displayMode, 
        sheetCart, 
        cartCount 
    } = computeCartDisplayLogic(carts)

    if(cartsError) {
        return <div>{cartsError.message}</div>
    }
    if(isLoading || !carts) {
        return <div>loading</div>
    }

    return displayMode === "cartSheet" ? (
        <CartSheet cart={sheetCart} count={cartCount}/>
    ) : (
        <CartDropDown carts={carts}/>
    )
}
