import React from 'react';
import type { Filters } from '../types';
import { StarIcon, PriceIcon, SearchIcon, LocationIcon } from './Icons';

interface FilterControlsProps {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    onRandomPick: () => void;
    isLocationAvailable: boolean;
}

const FilterControls: React.FC<FilterControlsProps> = ({ filters, setFilters, onRandomPick, isLocationAvailable }) => {

    const handleFilterChange = <K extends keyof Filters,>(key: K, value: Filters[K]) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const priceOptions = [{value: 0, label: "不限"}, {value: 1, label: "$"}, {value: 2, label: "$$"}, {value: 3, label: "$$$"}];
    const ratingOptions = [{value: 0, label: "不限"}, {value: 1, label: "1+"}, {value: 2, label: "2+"}, {value: 3, label: "3+"}, {value: 4, label: "4+"}];
    
    return (
        <div className="bg-white p-4 md:p-6 rounded-xl">
            <div className="flex flex-col gap-4">
                 {/* Search Input */}
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-slate-400" />
                    </span>
                    <input
                        type="text"
                        placeholder="搜尋餐廳名稱或類型..."
                        value={filters.searchQuery}
                        onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Price Filter */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600 flex items-center"><PriceIcon/>價位</label>
                        <div className="flex bg-slate-100 rounded-lg p-1">
                            {priceOptions.map(({value, label}) => (
                            <button key={value} onClick={() => handleFilterChange('price', value)}
                            className={`w-full py-2 px-1 text-sm rounded-md transition-colors duration-200 ${filters.price === value ? 'bg-sky-500 text-white shadow' : 'text-slate-700 hover:bg-slate-200'}`}>
                                {label}
                            </button>
                            ))}
                        </div>
                    </div>

                    {/* Rating Filter */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600 flex items-center"><StarIcon className="w-4 h-4 mr-1 text-amber-400"/>評分</label>
                        <div className="flex bg-slate-100 rounded-lg p-1">
                            {ratingOptions.map(({value, label}) => (
                            <button key={value} onClick={() => handleFilterChange('rating', value)}
                            className={`w-full py-2 px-1 text-sm rounded-md transition-colors duration-200 ${filters.rating === value ? 'bg-sky-500 text-white shadow' : 'text-slate-700 hover:bg-slate-200'}`}>
                                {label}
                            </button>
                            ))}
                        </div>
                    </div>

                    {/* Distance Filter */}
                    <div className="space-y-2">
                        <label htmlFor="distance" className="text-sm font-medium text-slate-600 flex items-center">
                           <LocationIcon className="w-4 h-4 mr-1" /> 距離: <span className="font-bold text-sky-600 ml-1">{filters.distance} km</span>
                        </label>
                        <input
                            type="range"
                            id="distance"
                            min="0.5"
                            max="5"
                            step="0.5"
                            value={filters.distance}
                            onChange={(e) => handleFilterChange('distance', Number(e.target.value))}
                            disabled={!isLocationAvailable}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {!isLocationAvailable && <p className="text-xs text-slate-400">請開啟定位以使用距離篩選</p>}
                    </div>
                    
                    {/* Random Pick Button */}
                    <div className="space-y-2">
                        {/* Invisible label for alignment */}
                        <label className="text-sm font-medium text-slate-600 flex items-center invisible">隨機</label>
                        <button
                            onClick={onRandomPick}
                            className="w-full bg-amber-400 text-amber-900 font-bold py-3 px-4 rounded-lg hover:bg-amber-500 transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-center">
                            <span role="img" aria-label="dice" className="mr-2 text-xl">🎲</span>
                            懶人隨機選
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterControls;