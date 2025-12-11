"use client"

import { cn } from '@/lib/utils'
import { CategoryMenu } from '@/types'

interface CategorySideBarProps {
    categoryMenus: CategoryMenu[],
    onSelectCategory: (categoryId: string) => void,
    activeCategoryId: string,
}

export default function CategorySideBar({categoryMenus, onSelectCategory, activeCategoryId}: CategorySideBarProps) {
    return (
        <aside className='w-1/4 sticky top-16 h-[calc(100vh-64px)]'>
            <p className='p-3 font-bold'>メニュー Menu</p>
            <nav>
                <ul>
                    {categoryMenus.map((category) => (
                        <li key={category.id}>
                            <button 
                                type='button'
                                className={cn('w-full p-4 text-left border-l-4 transition-colors', 
                                    activeCategoryId === category.id ? 
                                    'bg-input font-medium border-l-4 border-primary' : 
                                    'hover:bg-muted border-transparent'
                                )}
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
