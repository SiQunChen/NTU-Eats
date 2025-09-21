
import { useState, useEffect } from 'react';
import type { Coordinates } from '../types';

interface GeolocationState {
    loading: boolean;
    error: string | null;
    location: Coordinates | null;
}

export const useGeolocation = (): GeolocationState => {
    const [state, setState] = useState<GeolocationState>({
        loading: true,
        error: null,
        location: null,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setState({
                loading: false,
                error: '您的瀏覽器不支援地理位置功能',
                location: null,
            });
            return;
        }

        const onSuccess = (position: GeolocationPosition) => {
            setState({
                loading: false,
                error: null,
                location: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                },
            });
        };

        const onError = (error: GeolocationPositionError) => {
            let errorMessage = '無法取得您的位置';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = '您拒絕了位置請求，請開啟權限以計算距離';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = '位置資訊暫時無法取得';
                    break;
                case error.TIMEOUT:
                    errorMessage = '取得位置資訊超時';
                    break;
            }
             setState({
                loading: false,
                error: errorMessage,
                location: null,
            });
        };

        navigator.geolocation.getCurrentPosition(onSuccess, onError, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        });
        
    }, []);

    return state;
};
