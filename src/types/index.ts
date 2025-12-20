export interface Restaurant {
    id: string,
    restaurantName?: string,
    primaryType?: string,
    photoUrl: string,
}

export interface GooglePlacesSearchApiResponse {
    places?: PlaceSearchResult[]
}

export interface PlaceSearchResult {
    id: string,
    displayName?: {
        languageCode?: string,
        text?: string,
    },
    primaryType?: string,
    photos?: PlacePhoto[],
}

export interface PlacePhoto {
    name?: string,
}

export interface GooglePlacesAutoCompleteApiResponse {
    suggestions?: PlaceAutoCompleteResult[]
}

export interface PlaceAutoCompleteResult {
    placePrediction?: {
        place?: string,
        placeId?: string,
        structuredFormat?: {
            mainText?: {
                text?: string,
            },
            secondaryText?: {
                text?: string,
            }
        }
    },
    queryPrediction?: {
        text?: {
            text?: string,
        }
    }
}

export interface RestaurantSuggestion {
    type: string,
    placeId?: string,
    placeName: string,
}

export interface AddressSuggestion {
    placeId: string,
    placeName: string,
    address_text: string,
}

export interface GooglePlacesDetailsApiResponse {
    location?: {
        latitude?: number,
        longitude?: number,
    },
    displayName?: {
        languageCode?: string,
        text?: string,
    },
    primaryType?: string,
    photos?: PlacePhoto[],
}

export interface PlaceDetailsAll {
    location?: {
        latitude?: number,
        longitude?: number,
    },
    displayName?: string,
    primaryType?: string,
    photoUrl?: string,
}

export interface Address {
    id: number,
    name: string,
    address_text: string,
    latitude: number,
    longitude: number,
}

export interface AddressResponse {
    addressList: Address [],
    selectedAddress: Address,
}

export interface CategoryMenu {
    categoryName: string,
    id: string,
    items: Menu[]
}

export interface Menu {
    id: number,
    name: string,
    photoUrl: string,
    price: number,
}

export interface Cart {
    restaurantName: string | undefined;
    photoUrl: string | undefined;
    id: number;
    restaurant_id: string;
    cart_items: CartItem[]
}

export interface CartItem {
    id: number;
    quantity: number;
    menus: {
        id: number;
        name: string;
        price: number;
        image_path: string;
    } | null
}