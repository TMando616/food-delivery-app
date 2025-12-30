import { Cart } from "@/types";

export function computeCartDisplayLogic(carts: Cart[] | undefined, selectedCart: Cart | null) {
    // カート無し
    if(!carts || carts.length === 0) {
        return {displayMode: "cartSheet", sheetCart: null, cartCount: 0}
    }

    // カート1件だけ
    if(carts.length === 1) {
        const only = carts[0]
        return {
            displayMode: "cartSheet", 
            sheetCart: only, 
            cartCount: sumItems(only)
        }
    }

    // 選択されたカートがある場合
    if(selectedCart) {
        return {
            displayMode: "cartSheet", 
            sheetCart: selectedCart, 
            cartCount: sumItems(selectedCart)
        }
    }

    return {displayMode: "cartDropDown", sheetCart: null, cartCount: 0}
}

const sumItems = (cart: Cart) =>
    cart.cart_items.reduce((sum, item) => sum + item.quantity, 0)
