import { GooglePlacesSearchApiResponse } from "@/types";
import { transformPlaceResults } from "./utils";

export async function fetchRamenRestaurants() {
    const url ="https://places.googleapis.com/v1/places:searchNearby"

    const apiKey = process.env.GOOGLE_API_KEY
    
    const header = {
        "Content-type": "application/json",
        "X-Goog-Api-Key": apiKey!,
        "X-Goog-FieldMask": "places.id,places.displayName,places.primaryType,places.photos", // ほしいフィールドのみ取得（API料金が変わる）
    }

    const requestBody = {
        includedPrimaryTypes: ["ramen_restaurant"],
        maxResultCount: 10,
        locationRestriction: {
            circle: {
            center: {
                latitude: 35.6669248,
                longitude: 139.6514163},
            radius: 500.0
            }
        },
        languageCode: "ja",
        // rankPreference: "DISTANCE", // デフォルトはGoogleのおすすめ順
    };

    const response = await fetch(url,{
        method: "post",
        body: JSON.stringify(requestBody),
        headers: header,
        next: { revalidate: 86400 }, //24時間でキャッシュを更新
    })

    if (!response.ok) {
        const errorData = await response.json()
        console.error(errorData)
        return {error: `NearbySearchリクエスト失敗${response.status}`}
    }

    const data: GooglePlacesSearchApiResponse = await response.json();

    // console.log(data);

    if(!data.places) {
        return { data: [] }
    }
    
    const nearbyRamenPlaces = data.places 

    transformPlaceResults(nearbyRamenPlaces)

}