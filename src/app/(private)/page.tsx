import CarouselContainer from "@/components/carousel-container";
import RestaurantCard from "@/components/restaurant-card";
import Section from "@/components/section";
import { fetchRamenRestaurants } from "@/lib/restaurants/api";

export default async function Home() {
  const { data:neaybRamenRestaurants , error } = await fetchRamenRestaurants();

  return (
    <>
      {!neaybRamenRestaurants ? (
        <p>{error}</p>
      ) : neaybRamenRestaurants.length > 0 ? (
        <Section title="近くのお店">
          <CarouselContainer slideToShow={4}>
            {neaybRamenRestaurants.map((restaurant, index) => (
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
