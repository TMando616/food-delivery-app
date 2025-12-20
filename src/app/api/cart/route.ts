import { getPlaceDetails } from "@/lib/restaurants/api";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    try {
        const supabase = await createClient()

        const {data: { user }, error: userError} = await supabase.auth.getUser()
        if(userError || !user) {
            return NextResponse.json({error: "ユーザーが認証されていません"}, {status: 401})
        }

        const { data:carts, error:cartsError } = await supabase
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
            .eq("user_id", user.id)

        if(cartsError){
            console.log("カート情報を取得できませんでした。", cartsError)
            return NextResponse.json({error: "カート情報を取得できませんでした。"}, {status: 500})
        }

        const promises = carts.map(async (cart) => {
            const { data:restaurantData, error } = await getPlaceDetails(cart.restaurant_id, ["displayName","photos"])

            if(error || !restaurantData) {
                throw new Error(`レストランデータの取得に失敗しました。${error}`)
            }

            return {
                ...cart,
                restaurantName: restaurantData.displayName,
                photoUrl: restaurantData.photoUrl,
            }
        })

        const result = await Promise.all(promises)
        return NextResponse.json(result)
    } catch (error) {
        console.error(error)
        return NextResponse.json({error: "予期せぬエラーが発生しました。"}, {status: 500})
    }
}