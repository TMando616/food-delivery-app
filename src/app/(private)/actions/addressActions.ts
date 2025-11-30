"use server"

import { getPlaceDetails } from "@/lib/restaurants/api";
import { AddressSuggestion } from "@/types";

export async function selectSuggestionAction(
    suggestion: AddressSuggestion, 
    sessionToken: string
) {
    const {data:locationData , error} = await getPlaceDetails(suggestion.placeId, ["location"], sessionToken)
    console.log(locationData)
}