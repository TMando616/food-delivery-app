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

    const categoryMenus = []

    const featuredItems = menus
        .filter((menu) => menu.is_featured)
        .map((menu) => (
            {
                id: menu.id,
                photoUrl: supabase.storage.from("menus").getPublicUrl(menu.image_path).data.publicUrl,
                name: menu.name,
                price: menu.price
            }
        ))
    
    categoryMenus.push({
        categoryName: "注目商品",
        id: "featured",
        items: featuredItems
    })
}