"use client";
import { cn } from '@/lib/utils';
import { CategoryType } from './categories'
import Image from 'next/image';

interface CategoryProps {
    category: CategoryType;
    onClick: (category: string) => void
    select: boolean;
}

export default function Category({ category, onClick, select }:CategoryProps ) {


    return (
        <div onClick={() => onClick(category.type)}>
            <div className={cn('relative aspect-square overflow-hidden rounded-full', select && 'bg-green-200')}>
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
