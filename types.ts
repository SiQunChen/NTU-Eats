
export interface Restaurant {
    id: number;
    name: string;
    cuisine: string;
    latitude: number;
    longitude: number;
    priceRange: 1 | 2 | 3;
    rating: number;
    googleMapsUrl: string;
}

export interface RestaurantWithDistance extends Restaurant {
    distance: number; // in kilometers
}

export interface Filters {
    searchQuery: string;
    price: number; // 0 for all, 1, 2, 3
    rating: number; // 0 for all, 1-5
    distance: number; // in kilometers
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}
