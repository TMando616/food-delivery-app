"use server"

import { getPlaceDetails } from "@/lib/restaurants/api";
import { AddressSuggestion } from "@/types";

export async function selectSuggestionAction(
    suggestion: AddressSuggestion, 
    sessionToken: string
) {
    console.log("server_action",suggestion)

    await getPlaceDetails(suggestion.placeId, ["location"], sessionToken)
}