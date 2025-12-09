import CategorySideBar from "./category-side-bar";

export default function MenuContent() {
  return (
    <div className="flex gap-4">
        <CategorySideBar />
        <div className="w-3/4 bg-blue-50">Menu</div>
    </div>
  )
}
