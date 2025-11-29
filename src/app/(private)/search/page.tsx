import Categories from '@/components/categories';
import RestaurantList from '@/components/restaurant-list';
import { fetchCategoryRetaurants, fetchRetaurantsByKeyword } from '@/lib/restaurants/api';

export default async function SearchPage({
        searchParams
    }: {
        searchParams: Promise<{category: string, restaurant: string}>
    }) {

        const { category, restaurant } = await searchParams;

        if(category) {
            const {data:categoryRestaurants, error:fetchError} = await fetchCategoryRetaurants(category);

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

        } else if (restaurant) {
            const {data:restaurants, error:fetchError} = await fetchRetaurantsByKeyword(restaurant);
            console.log(restaurants)
        }

}
