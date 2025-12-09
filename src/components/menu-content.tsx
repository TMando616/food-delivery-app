import { CategoryMenu } from "@/types";
import CategorySideBar from "./category-side-bar";
import Section from "./section";

interface MenuContentProps {
    categoryMenus: CategoryMenu[]
}

export default function MenuContent({categoryMenus}:MenuContentProps ) {
  return (
    <div className="flex gap-4">
        <CategorySideBar categoryMenus={categoryMenus}/>
        <div className="w-3/4 bg-blue-50">
            {categoryMenus.map((category) => (
                <Section title={category.categoryName} key={category.id}>
                    {category.id === "featured" ? (
                        <div>スクロール</div>
                    ): (
                        <div>リストメニュー</div>
                    )}
                </Section>
            ))}
        </div>
    </div>
  )
}
