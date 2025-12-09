import { CategoryMenu } from '@/types'
import React from 'react'

interface CategorySideBarProps {
    categoryMenus: CategoryMenu[]
}

export default function CategorySideBar({categoryMenus}: CategorySideBarProps) {
  return (
    <aside className='w-1/4 bg-amber-50'>
        <p className='p-3 font-bold'>メニュー Menu</p>
        <nav>
            <ul>
                {categoryMenus.map((category) => (
                    <li key={category.id}>
                        <button 
                            type='button'
                            className='bg-red-100 w-full p-4 text-left'
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
