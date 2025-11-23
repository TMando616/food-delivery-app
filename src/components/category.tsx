import React from 'react'
import { CategoryType } from './categories'
import Image from 'next/image';

interface CategoryProps {
    category: CategoryType;
}

export default function Category({ category }:CategoryProps ) {
    return (
        <div>
            <div className='relative aspect-square overflow-hidden rounded-full'>
                <Image 
                    className='object-cover scale-75' 
                    src={category.imageUrl} 
                    sizes='(max-width: 1280px) 10vw, 280px'
                    fill 
                    alt={category.categoryName}
                />
            </div>
            <div className='text-center mt-2'>
                <p className='text-xs truncate'>{category.categoryName}</p>
            </div>
        </div>
    )
}
