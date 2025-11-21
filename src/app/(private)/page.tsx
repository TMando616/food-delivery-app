import CarouselContainer from "@/components/carousel-container";
import RestaurantCard from "@/components/restaurant-card";
import Section from "@/components/section";
import { fetchRamenRestaurants, fetchRestaurants } from "@/lib/restaurants/api";

export default async function Home() {
  const { data:neaybyRamenRestaurants , error: nearbyRamenRestaurantError } = await fetchRamenRestaurants();
  const { data:neaybyRestaurants , error: nearbyRestaurantError } = await fetchRestaurants();

  return (
    <>
      {!neaybyRestaurants ? (
        <p>{nearbyRestaurantError}</p>
      ) : neaybyRestaurants.length > 0 ? (
        <Section title="近くのレストラン">
          <CarouselContainer slideToShow={4}>
            {neaybyRestaurants.map((restaurant, index) => (
              <RestaurantCard key={index} restaurant={restaurant} />
            ))}
          </CarouselContainer>
        </Section>
      ) : (
        <p>近くにレストランがありません。</p>
      )}

      {!neaybyRamenRestaurants ? (
        <p>{nearbyRamenRestaurantError}</p>
      ) : neaybyRamenRestaurants.length > 0 ? (
        <Section title="近くのラーメン店">
          <CarouselContainer slideToShow={4}>
            {neaybyRamenRestaurants.map((restaurant, index) => (
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
