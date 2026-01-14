import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function fetchOrders () {

    const supabase = await createClient()

    const { 
        data: { user }, 
        error: userError
    } = await supabase.auth.getUser()
    
    if(userError || !user) {
        redirect('/login')
    }

    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
            id,
            restaurant_id,
            created_at,
            fee,
            service,
            delivery,
            subtotal_price,
            total_price,
            order_items (
                id,
                price,
                quanaity,
                name,
                image_path,
            )
        `)
        .eq('user_id', user.id)

    if(ordersError) {
        console.error('注文履歴の取得に失敗しました。', ordersError)
        throw new Error('注文履歴の取得に失敗しました。')
    }
}