
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Restaurant, RestaurantWithDistance, Filters } from './types';
import { useGeolocation } from './hooks/useGeolocation';
import { calculateDistance } from './utils/distance';
import { isRestaurantOpen } from './utils/time';
import Header from './components/Header';
import FilterModal from './components/FilterModal';
import RestaurantCard from './components/RestaurantCard';
import { LoadingIcon } from './components/Icons';

const App: React.FC = () => {
    const { location, loading: locationLoading, error: locationError } = useGeolocation();
    const [restaurants, setRestaurants] = useState<RestaurantWithDistance[]>([]);
    const [restaurantsLoading, setRestaurantsLoading] = useState<boolean>(true);
    const [filteredRestaurants, setFilteredRestaurants] = useState<RestaurantWithDistance[]>([]);
    const [randomPicks, setRandomPicks] = useState<RestaurantWithDistance[]>([]);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const [filters, setFilters] = useState<Filters>({
        searchQuery: '',
        price: 0,
        rating: 0,
        distance: 5, // Default max distance 5km
        openNow: false,
    });

    useEffect(() => {
        const fetchRestaurants = async () => {
            setRestaurantsLoading(true);
            try {
                // 將路徑改為相對於根目錄
                const response = await fetch('/services/data.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: Restaurant[] = await response.json();
                const initialRestaurants = data.map(r => ({ ...r, distance: 0 }));
                setRestaurants(initialRestaurants);
            } catch (e) {
                console.error("Failed to fetch restaurants:", e);
            } finally {
                setRestaurantsLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    const restaurantsWithDistance = useMemo(() => {
        if (!location) return restaurants;
        return restaurants.map(r => ({
            ...r,
            distance: calculateDistance(location.latitude, location.longitude, r.latitude, r.longitude)
        })).sort((a, b) => a.distance - b.distance);
    }, [location, restaurants]);

    useEffect(() => {
        let result = restaurantsWithDistance;

        const query = filters.searchQuery.toLowerCase().trim();
        if (query) {
            result = result.filter(r =>
                r.name.toLowerCase().includes(query) ||
                r.cuisine.toLowerCase().includes(query)
            );
        }

        if (filters.price > 0) {
            result = result.filter(r => r.priceRange === filters.price);
        }
        if (filters.rating > 0) {
            result = result.filter(r => r.rating >= filters.rating);
        }
        if (filters.openNow) {
            result = result.filter(r => isRestaurantOpen(r));
        }
        if (location) {
             result = result.filter(r => r.distance <= filters.distance);
        }

        setFilteredRestaurants(result);
        setRandomPicks([]); // Clear random picks when filters change
    }, [filters, restaurantsWithDistance, location]);
    
    const handleRandomPick = useCallback(() => {
        const sourceList = filteredRestaurants.length > 0 ? filteredRestaurants : restaurantsWithDistance;
        const shuffled = [...sourceList].sort(() => 0.5 - Math.random());
        setRandomPicks(shuffled.slice(0, 3));
        
        // Scroll to the results
        const element = document.getElementById('random-picks-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, [filteredRestaurants, restaurantsWithDistance]);


    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
            <Header onSearchClick={() => setIsFilterModalOpen(true)} />
            
            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                filters={filters}
                setFilters={setFilters}
                onRandomPick={() => {
                    handleRandomPick();
                    setIsFilterModalOpen(false);
                }}
                isLocationAvailable={!!location}
            />

            <main className="container mx-auto p-4 md:p-8 pt-24">
                {locationLoading && (
                    <div className="flex justify-center items-center gap-2 text-sky-600 p-8">
                        <LoadingIcon />
                        <span>正在取得您的位置...</span>
                    </div>
                )}
                
                {randomPicks.length > 0 && (
                    <section id="random-picks-section" className="my-8">
                        <h2 className="text-2xl font-bold mb-4 text-center text-slate-700">為您抽籤的結果！</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {randomPicks.map(restaurant => (
                                <RestaurantCard key={restaurant.id} restaurant={restaurant} isLocationAvailable={!!location} />
                            ))}
                        </div>
                    </section>
                )}

                {randomPicks.length > 0 && <div className="border-t border-slate-200 my-8"></div>}

                <h2 className="text-2xl font-bold mb-4 text-slate-700">餐廳列表 ({restaurantsLoading ? '...' : filteredRestaurants.length})</h2>
                {restaurantsLoading ? (
                    <div className="flex justify-center items-center gap-2 text-sky-600 p-8">
                        <LoadingIcon />
                        <span>正在載入餐廳列表...</span>
                    </div>
                ) : filteredRestaurants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredRestaurants.map(restaurant => (
                            <RestaurantCard key={restaurant.id} restaurant={restaurant} isLocationAvailable={!!location} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
                        <p className="text-slate-500 text-lg">找不到符合條件的餐廳。</p>
                        <p className="text-slate-400 mt-2">試試看放寬篩選條件？</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
