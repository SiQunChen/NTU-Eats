import type { RestaurantWithDistance } from '../types';

/**
 * 根據目前時間判斷餐廳是否營業中
 * @param restaurant 餐廳物件
 * @returns 如果營業中則回傳 true，否則回傳 false
 */
export const isRestaurantOpen = (restaurant: RestaurantWithDistance): boolean => {
    const { openingHours } = restaurant;
    // 如果沒有營業時間資訊，保守起見當作休息中
    if (!openingHours || openingHours.length === 0) {
        return false;
    }

    const now = new Date();
    const currentDay = now.getDay(); // 0 = 週日, 1 = 週一, ..., 6 = 週六
    const currentTime = now.getHours() * 100 + now.getMinutes(); // 將時間轉為數字，例如 14:30 -> 1430

    for (const period of openingHours) {
        const { open, close } = period;

        // 處理 24 小時營業的情況
        if (open.day === 0 && open.time === "0000" && !close) {
            return true;
        }

        // 如果資料不完整則跳過
        if (!close) continue;

        const openDay = open.day;
        const openTime = parseInt(open.time, 10);
        const closeDay = close.day;
        const closeTime = parseInt(close.time, 10);

        // 處理跨午夜的營業時間 (例如：週六 22:00 開到 週日 03:00)
        if (openDay > closeDay) {
            // 現在時間在開店日當天，且晚於開店時間
            if (currentDay === openDay && currentTime >= openTime) {
                return true;
            }
            // 現在時間在關店日當天，且早於關店時間
            if (currentDay === closeDay && currentTime < closeTime) {
                return true;
            }
        } else { // 處理當天開店關店的情況
            if (currentDay === openDay && currentTime >= openTime && currentTime < closeTime) {
                return true;
            }
        }
    }

    // 都沒匹配到就是休息中
    return false;
};