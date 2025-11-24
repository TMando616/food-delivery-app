import { fetchCategoryRetaurants } from '@/lib/restaurants/api';
import React from 'react'

export default async function SearchPage({searchParams}: {searchParams: Promise<{category: string}>}) {

    const { category } = await searchParams;
    console.log(category)

    if(category) {
        const {data:categoryRestaurants, error:fetchError} = await fetchCategoryRetaurants(category);
        console.log(categoryRestaurants)
    }

    return (
        <div>
            aaaaaaaaaaa
        </div>
    )
}
