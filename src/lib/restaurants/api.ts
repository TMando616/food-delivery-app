export async function fetchRamenRestaurants() {
    const url ="https://places.googleapis.com/v1/places:searchNearby"

    const apiKey = process.env.GOOGLE_API_KEY
    
    const header = {
        "Content-type": "application/json",
        "X-Goog-Api-Key": apiKey!,
        "X-Goog-FieldMask": "places.id,places.displayName,places.types,places.primaryType,places.photos", // ほしいフィールドのみ取得（API料金が変わる）
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
    })

    const data = await response.json();

    console.log(data);

}