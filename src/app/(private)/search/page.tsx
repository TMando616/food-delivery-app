import Categories from '@/components/categories';
import RestaurantList from '@/components/restaurant-list';
import { fetchCategoryRetaurants } from '@/lib/restaurants/api';

export default async function SearchPage({searchParams}: {searchParams: Promise<{category: string}>}) {

    const { category } = await searchParams;
    console.log(category)

    if(category) {
        const {data:categoryRestaurants, error:fetchError} = await fetchCategoryRetaurants(category);
        console.log(categoryRestaurants)

        return (
            <>
                <div className='mb-4'>
                    <Categories />
                </div>
                {!categoryRestaurants ? (
                    <p className='text-destructive'>{fetchError}</p>
                ) : categoryRestaurants.length > 0 ? (
                    <RestaurantList restaurants={categoryRestaurants}/>
                ) : (
                    <p>カテゴリ<strong>{category}</strong>に一致するレストランがありません。</p>
                )}
            </>
        )

    }

}
