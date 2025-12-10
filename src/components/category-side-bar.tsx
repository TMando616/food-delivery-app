"use client"

import { CategoryMenu } from '@/types'

interface CategorySideBarProps {
    categoryMenus: CategoryMenu[],
    onSelectCategory: (categoryId: string) => void,
}

export default function CategorySideBar({categoryMenus, onSelectCategory}: CategorySideBarProps) {
    return (
        <aside className='w-1/4 bg-amber-50 sticky top-16 h-[calc(100vh-64px)]'>
            <p className='p-3 font-bold'>メニュー Menu</p>
            <nav>
                <ul>
                    {categoryMenus.map((category) => (
                        <li key={category.id}>
                            <button 
                                type='button'
                                className='bg-red-100 w-full p-4 text-left'
                                onClick={() => onSelectCategory(category.id)}
                            >
                                {category.categoryName}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}
