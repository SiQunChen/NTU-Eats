
import React from 'react';
import type { RestaurantWithDistance } from '../types';
import { StarIcon, LocationIcon, MapIcon } from './Icons';

interface RestaurantCardProps {
    restaurant: RestaurantWithDistance;
    isLocationAvailable: boolean;
}

const PriceDisplay: React.FC<{ range: 1 | 2 | 3 }> = ({ range }) => (
    <span className="text-green-600 font-semibold">
        {'$'.repeat(range)}
        <span className="text-slate-300">{'$'.repeat(3 - range)}</span>
    </span>
);

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, isLocationAvailable }) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
            <div className="p-5 flex-grow">
                <div className="flex justify-between items-start">
                    <p className="text-xs font-semibold text-sky-500 uppercase tracking-wide">{restaurant.cuisine}</p>
                    <div className="flex items-center text-sm">
                        <StarIcon className="w-4 h-4 text-amber-400 mr-1" />
                        <span className="font-bold text-slate-600">{restaurant.rating.toFixed(1)}</span>
                    </div>
                </div>
                <h3 className="mt-1 text-lg leading-tight font-bold text-slate-800">{restaurant.name}</h3>
                <div className="mt-4 flex justify-between items-center text-sm text-slate-500">
                    <PriceDisplay range={restaurant.priceRange} />
                    {isLocationAvailable && (
                        <div className="flex items-center">
                            <LocationIcon />
                            <span>{restaurant.distance.toFixed(1)} km</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-slate-50 p-3">
                 <a
                    href={restaurant.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-sky-500 hover:text-white transition-colors duration-200"
                >
                   <MapIcon />
                   Google Maps
                </a>
            </div>
        </div>
    );
};

export default RestaurantCard;
