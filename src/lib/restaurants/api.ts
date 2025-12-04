import { GooglePlacesDetailsApiResponse, GooglePlacesSearchApiResponse, PlaceDetailsAll } from "@/types";
import { transformPlaceResults } from "./utils";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// 近くのレストランを取得
export async function fetchRestaurants() {
    const url ="https://places.googleapis.com/v1/places:searchNearby"

    const apiKey = process.env.GOOGLE_API_KEY
    
    const header = {
        "Content-type": "application/json",
        "X-Goog-Api-Key": apiKey!,
        "X-Goog-FieldMask": "places.id,places.displayName,places.primaryType,places.photos", // ほしいフィールドのみ取得（API料金が変わる）
    }

    const desiredTypes = [
        "japanese_restaurant",
        "cafe",
        "cafeteria",
        "coffee_shop",
        "chinese_restaurant",
        "fast_food_restaurant",
        "hamburger_restaurant",
        "french_restaurant",
        "italian_restaurant",
        "pizza_restaurant",
        "ramen_restaurant",
        "sushi_restaurant",
        "korean_restaurant",
        "indian_restaurant",
    ]

    const requestBody = {
        includedTypes: desiredTypes,
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
    
    const nearbyPlaces = data.places 
    const matchingPlace = nearbyPlaces.filter((place) => place.primaryType && desiredTypes.includes(place.primaryType))

    const Restaurants = await transformPlaceResults(matchingPlace)
    // console.log(Restaurants)

    return { data: Restaurants }

}

// 近くのラーメン店を取得
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

    const RamenRestaurants = await transformPlaceResults(nearbyRamenPlaces)

    return { data: RamenRestaurants }

}

// カテゴリ検索機能
export async function fetchCategoryRetaurants(category: string) {
    const url ="https://places.googleapis.com/v1/places:searchNearby"

    const apiKey = process.env.GOOGLE_API_KEY
    
    const header = {
        "Content-type": "application/json",
        "X-Goog-Api-Key": apiKey!,
        "X-Goog-FieldMask": "places.id,places.displayName,places.primaryType,places.photos", // ほしいフィールドのみ取得（API料金が変わる）
    }

    const requestBody = {
        includedPrimaryTypes: [category],
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
    
    const nearbyCategoryPlaces = data.places 

    const categoryRestaurants = await transformPlaceResults(nearbyCategoryPlaces)

    return { data: categoryRestaurants }

}

// キーワード検索機能
export async function fetchRetaurantsByKeyword(query: string) {
    const url ="https://places.googleapis.com/v1/places:searchText"

    const apiKey = process.env.GOOGLE_API_KEY
    
    const header = {
        "Content-type": "application/json",
        "X-Goog-Api-Key": apiKey!,
        "X-Goog-FieldMask": "places.id,places.displayName,places.primaryType,places.photos", // ほしいフィールドのみ取得（API料金が変わる）
    }

    const requestBody = {
        textQuery: query,
        pageSize: 10,
        locationBias: {
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
        return {error: `TextSearchリクエスト失敗${response.status}`}
    }

    const data: GooglePlacesSearchApiResponse = await response.json();

    // console.log(data);

    if(!data.places) {
        return { data: [] }
    }
    
    const textSearchPlaces = data.places 

    const restaurants = await transformPlaceResults(textSearchPlaces)

    return { data: restaurants }

}

export async function getPhotoUrl(name: string, maxWidth = 400) { // use cacheを使用するためにasync
    "use cache"; // 引数が同一であれば2回目以降はキャッシュで同じ値を返却する
    console.log("getPhotoUrl実行")
    const apiKey = process.env.GOOGLE_API_KEY
    const url = `https://places.googleapis.com/v1/${name}/media?key=${apiKey}&maxWidthPx=${maxWidth}`
    return url
}

export async function getPlaceDetails(placeId: string, fields: string[], sessionToken?: string) {
    let url:string;

    const fieldsParam = fields.join(",")

    if(sessionToken) {
        url = `https://places.googleapis.com/v1/places/${placeId}?sessionToken=${sessionToken}&languageCode=ja`
    } else {
        url = `https://places.googleapis.com/v1/places/${placeId}?languageCode=ja`
    }
    
    const apiKey = process.env.GOOGLE_API_KEY
    
    const header = {
        "Content-type": "application/json",
        "X-Goog-Api-Key": apiKey!,
        "X-Goog-FieldMask": fieldsParam,
    }

    const response = await fetch(url,{
        method: "get",
        headers: header,
        next: { revalidate: 86400 }, //24時間でキャッシュを更新
    })

    if (!response.ok) {
        const errorData = await response.json()
        console.error(errorData)
        return {error: `PlaceDetailsリクエスト失敗${response.status}`}
    }

    const data: GooglePlacesDetailsApiResponse = await response.json();

    const results: PlaceDetailsAll = {}

    if(fields.includes("location") && data.location) {
        results.location = data.location
    }

    return {data: results}

}

export async function fetchLocation() {
    const DEFAULT_LOCAION = { lat: 35.6669248, lng: 139.6514163 }

    const supabase = await createClient()

    const {data: {user}, error: userError } = await supabase.auth.getUser()
    
    if(userError || !user) {
        redirect("/login")
    }

    // 選択中の住所の緯度と経度を取得
    
    const { data: selectedAddress, error: selectedAddressError } = await supabase
        .from('profiles')
        .select(`
            addresses (
                latitude,
                longitude
            )
        `)
        .eq('id', user.id)
        .single()

    if(selectedAddressError) {
        console.error("緯度と経度の取得に失敗しました。", selectedAddressError)
        throw new Error("緯度と経度の取得に失敗しました。")
    }

    const lat = selectedAddress.addresses?.latitude ?? DEFAULT_LOCAION.lat
    const lng = selectedAddress.addresses?.longitude ?? DEFAULT_LOCAION.lng

    return { lat, lng }
}