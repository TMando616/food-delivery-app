import { createClient } from "@/utils/supabase/server"

export async function fetchCategoryMenus(primaryType: string) {

    const supabase = await createClient()
    
    const { data: menus, error:menusError } = await supabase
        .from('menus')
        .select('*')
        .eq("genre", primaryType)

    if(menusError) {
        console.error("メニューの取得に失敗しました。", menusError)
        return {error: "メニューの取得に失敗しました。"}
    }

    if(menus.length === 0) {
        return {data: []}
    }

}