export interface OpeningHoursPeriod {
  open: {
    day: number; // 0 (Sunday) to 6 (Saturday)
    time: string; // "HHMM"
  };
  close?: {
    day: number;
    time: string;
  };
}

export interface Restaurant {
    id: number;
    name: string;
    cuisine: string;
    latitude: number;
    longitude: number;
    priceRange: 1 | 2 | 3;
    rating: number;
    googleMapsUrl: string;
    openingHours?: OpeningHoursPeriod[]; // <--- 新增此行
}

export interface RestaurantWithDistance extends Restaurant {
    distance: number; // in kilometers
}

export interface Filters {
    searchQuery: string;
    price: number; // 0 for all, 1, 2, 3
    rating: number; // 0 for all, 1-5
    distance: number; // in kilometers
    openNow: boolean; // <--- 新增此行
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}