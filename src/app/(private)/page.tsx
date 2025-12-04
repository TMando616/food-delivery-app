import CarouselContainer from "@/components/carousel-container";
import Categories from "@/components/categories";
import RestaurantCard from "@/components/restaurant-card";
import RestaurantList from "@/components/restaurant-list";
import Section from "@/components/section";
import { fetchLocation, fetchRamenRestaurants, fetchRestaurants } from "@/lib/restaurants/api";

export default async function Home() {
  const { lat, lng } = await fetchLocation()
  const { data:nearbyRamenRestaurants , error: nearbyRamenRestaurantError } = await fetchRamenRestaurants(lat, lng);
  const { data:nearbyRestaurants , error: nearbyRestaurantError } = await fetchRestaurants(lat, lng);

  return (
    <>
    <Categories />

    {/* レストラン情報 */}
      {!nearbyRestaurants ? (
        <p>{nearbyRestaurantError}</p>
      ) : nearbyRestaurants.length > 0 ? (
        <Section title="近くのレストラン" expandedContent={<RestaurantList restaurants={nearbyRestaurants}/>}>
          <CarouselContainer slideToShow={4}>
            {nearbyRestaurants.map((restaurant, index) => (
              <RestaurantCard key={index} restaurant={restaurant} />
            ))}
          </CarouselContainer>
        </Section>
      ) : (
        <p>近くにレストランがありません。</p>
      )}

    {/* ラーメン店情報 */}
      {!nearbyRamenRestaurants ? (
        <p>{nearbyRamenRestaurantError}</p>
      ) : nearbyRamenRestaurants.length > 0 ? (
        <Section title="近くのラーメン店"  expandedContent={<RestaurantList  restaurants={nearbyRamenRestaurants}/>}>
          <CarouselContainer slideToShow={4}>
            {nearbyRamenRestaurants.map((restaurant, index) => (
              <RestaurantCard key={index} restaurant={restaurant} />
            ))}
          </CarouselContainer>
        </Section>
      ) : (
        <p>近くにラーメン店がありません。</p>
      )}
    </>
  );
}
