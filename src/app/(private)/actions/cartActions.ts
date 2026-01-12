"use server"

import { getPlaceDetails } from "@/lib/restaurants/api";
import { Cart, Menu } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type addToCartActionResonse = { type: "new", cart: Cart } | {type: "update", id: number}

export async function addToCartAction(selectedItem: Menu, quantity: number, restaurantId: string):Promise<addToCartActionResonse>{
    const supabase = await createClient()
    const bucket = supabase.storage.from("menus")

    const {data: {user}, error: userError } = await supabase.auth.getUser()
    
    if(userError || !user) {
        redirect("/login")
    }

    const { data: existingCart, error: existingCartError} = await supabase
        .from("carts")
        .select("id")
        .match({user_id: user.id, restaurant_id: restaurantId})
        .maybeSingle()

    if(existingCartError) {
        console.error("カートの取得に失敗しました。", existingCartError)
        throw new Error("カートの取得に失敗しました。")
    }

    // 既存のカートが存在しない場合、カートを新規作成&アイテムを追加

    if(!existingCart) {
        const { data: newCart, error: newCartError} = await supabase
            .from("carts")
            .insert({
                restaurant_id: restaurantId,
                user_id: user.id,
            })
            .select("id")
            .single()
        
        if(newCartError) {
            console.error("カートの作成に失敗しました。", existingCartError)
            throw new Error("カートの作成に失敗しました。")
        }

        const newCartId = newCart.id
        // カートの中にアイテムを追加
        const { error: insertError } = await supabase
            .from("cart_items")
            .insert({
                quantity: quantity,
                cart_id: newCartId,
                menu_id: selectedItem.id,
            })

        if(insertError) {
            console.error("カートアイテムの追加に失敗しました。", insertError)
            throw new Error("カートアイテムの追加に失敗しました。")
        }

        const { data: insertedCarts, error: insertedCartsError } = await supabase
            .from('carts')
            .select(`
                id,
                restaurant_id,
                cart_items (
                    id,
                    quantity,
                    menus (
                        id,
                        name,
                        price,
                        image_path
                    )
                )
            `)
            .match({"user_id": user.id, id: newCartId })
            .single()
        
        if(insertedCartsError) {
            console.error("カートデータの取得に失敗しました。", insertedCartsError)
            throw new Error(`カートデータの取得に失敗しました。 ${insertedCartsError} `)
        }
            
        const { data:restaurantData, error } = await getPlaceDetails(restaurantId, ["displayName","photos"])

        if(error || !restaurantData) {
            throw new Error(`レストランデータの取得に失敗しました。${error}`)
        }

        const updatedCart = {
            ...insertedCarts,
            cart_items: insertedCarts.cart_items.map((item) => {
                const { image_path, ...restMenus } = item.menus!
                const publicUrl = bucket.getPublicUrl(item.menus!.image_path).data.publicUrl
                return {
                    ...item,
                    menus: {
                        ...restMenus,
                        photoUrl: publicUrl
                    }
                }
            }),
            restaurantName: restaurantData.displayName,
            photoUrl: restaurantData.photoUrl,
        }

        return { type: "new", cart: updatedCart }
    }

    // 既存のカートが存在する場合、アイテムを追加or数量を変更
    const { data, error: upsertError } = await supabase
        .from("cart_items")
        .upsert(
            {
                quantity: quantity,
                cart_id: existingCart.id,
                menu_id: selectedItem.id,
            }, 
            {onConflict: "menu_id,cart_id"}
        ).select("id")
        .single()

    if(upsertError) {
        console.error("カートアイテムの追加・更新に失敗しました。", upsertError)
        throw new Error("カートアイテムの追加・更新に失敗しました。")
    }

    return{type: "update", id: data.id}
}

export async function updateCartItemAction(quantity: number, cartItemId: number, cartId: number) {

    const supabase = await createClient()

    const {
        data: {user},
        error: userError,
    } = await supabase.auth.getUser()

    if(userError || !user) {
        redirect("/login")
    }

    if(quantity === 0) {
        // 削除処理
        const { count, error } = await supabase
            .from("cart_items")
            .select("*", {count: "exact", head: true})
            .eq("cart_id", cartId)
        
        if (error) {
            console.error("カートの取得に失敗しました", error)
            throw new Error("カートの取得に失敗しました")
        }

        // カート自体を削除
        if( count === 1) {
            const { error: deleteCartError } = await supabase
                .from("carts")
                .delete()
                .match({ user_id: user.id, id: cartId })

            if(deleteCartError) {
                console.error("カートの削除に失敗しました", deleteCartError)
                throw new Error("カートの削除に失敗しました")
            }

            return 
        }

        const { error: deleteitemError} = await supabase
            .from("cart_items")
            .delete()
            .eq("id", cartItemId)

        if(deleteitemError) {
            console.error("カートアイテムの削除に失敗しました", deleteitemError)
            throw new Error("カートアイテムの削除に失敗しました")
        }

        return
    } else {
        // 数量更新
        const { error: updateError} = await supabase
            .from("cart_items")
            .update({
                quantity: quantity,
            })
            .eq("id", cartItemId)

        if(updateError) {
            console.error("カートアイテムの更新に失敗しました", updateError)
            throw new Error("カートアイテムの更新に失敗しました")
        }
    }

}

export async function checkoutAction(cartId: number) {
    
}