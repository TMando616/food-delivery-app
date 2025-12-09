import { CategoryMenu } from "@/types";
import CategorySideBar from "./category-side-bar";

interface MenuContentProps {
    categoryMenus: CategoryMenu[]
}

export default function MenuContent({categoryMenus}:MenuContentProps ) {
  return (
    <div className="flex gap-4">
        <CategorySideBar categoryMenus={categoryMenus}/>
        <div className="w-3/4 bg-blue-50">Menu</div>
    </div>
  )
}
