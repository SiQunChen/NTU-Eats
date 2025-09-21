// scripts/addRestaurant.js

import axios from 'axios';
import readline from 'readline/promises';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 從環境變數讀取您的 API 金鑰
const { GOOGLE_MAPS_API_KEY } = process.env;

if (!GOOGLE_MAPS_API_KEY) {
    console.error('錯誤：請設定 GOOGLE_MAPS_API_KEY 環境變數');
    process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, '..', 'public', 'services', 'data.json');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const cuisineOptions = ['台式', '日式', '韓式', '泰式', '越式', '義式', '美式', '健康餐', '其它'];

// 【修正】讓函式接收 restaurantName 參數
async function selectCuisine(restaurantName) {
    // 【修正】使用傳入的 restaurantName 參數，而不是無法存取的 place 變數
    console.log(`\n請為餐廳 "${restaurantName}" 選擇一個菜系分類：`);
    cuisineOptions.forEach((option, index) => {
        console.log(`  ${index + 1}. ${option}`);
    });

    while (true) {
        const answer = await rl.question(`\n請輸入對應的數字 (1-${cuisineOptions.length}): `);
        const choice = parseInt(answer, 10);
        if (!isNaN(choice) && choice >= 1 && choice <= cuisineOptions.length) {
            return cuisineOptions[choice - 1];
        } else {
            console.log(`\n❌ 輸入無效，請重新輸入一個介於 1 到 ${cuisineOptions.length} 之間的數字。`);
        }
    }
}


// 主要的函式
async function getRestaurantDetails(placeName) {
    const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(placeName)}&inputtype=textquery&fields=place_id&key=${GOOGLE_MAPS_API_KEY}`;

    try {
        // --- 搜尋地點 ---
        const searchResponse = await axios.get(searchUrl);
        if (searchResponse.data.status !== 'OK' || !searchResponse.data.candidates.length) {
            throw new Error(`在 Google Maps 找不到符合的地點: ${placeName}`);
        }
        const placeId = searchResponse.data.candidates[0].place_id;

        // --- 取得詳細資訊 ---
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,geometry,price_level,url,types,opening_hours&key=${GOOGLE_MAPS_API_KEY}`;
        const detailsResponse = await axios.get(detailsUrl);
        if (detailsResponse.data.status !== 'OK') {
            throw new Error('無法取得地點的詳細資訊');
        }
        const place = detailsResponse.data.result;

        // --- 讀取並解析現有的 data.json ---
        const dataFile = await fs.readFile(dataFilePath, 'utf8');
        
        const restaurants = dataFile ? JSON.parse(dataFile) : [];

        // --- 檢查是否重複 ---
        const isDuplicate = restaurants.some(r => r.name === place.name || r.googleMapsUrl === place.url);
        if (isDuplicate) {
            console.warn(`\n⚠️  警告：餐廳 "${place.name}" 已經存在於 data.json 中，將不會重複新增。`);
            return;
        }

        // 【修正】呼叫函式時，將 place.name 傳遞進去
        const selectedCuisine = await selectCuisine(place.name);

        // --- 產生新的餐廳物件 ---
        const newId = restaurants.length > 0 ? Math.max(...restaurants.map(r => r.id)) + 1 : 1;

        const newRestaurant = {
            id: newId,
            name: place.name,
            cuisine: selectedCuisine,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            priceRange: place.price_level || 2,
            rating: place.rating,
            googleMapsUrl: place.url,
            openingHours: place.opening_hours ? place.opening_hours.periods : []
        };

        // --- 將新餐廳加入陣列並寫回檔案 ---
        restaurants.push(newRestaurant);
        await fs.writeFile(dataFilePath, JSON.stringify(restaurants, null, 4), 'utf8');
        
        console.log(`\n✅ 成功！餐廳 "${place.name}" (${selectedCuisine}) 已自動新增到 public/services/data.json 中！`);
        console.log('\n----------------------------------------\n');

    } catch (error) {
        if (error instanceof SyntaxError) {
            console.error('\n❌ 發生錯誤：data.json 檔案格式錯誤，無法解析。請檢查檔案內容是否為有效的 JSON。');
        } else {
            console.error('\n❌ 發生錯誤：', error.message);
        }
    }
}

async function parsePlaceNameFromUrl(url) {
    try {
        let decodedUrl = decodeURIComponent(url);
        let match = decodedUrl.match(/maps\/place\/([^/]+)/);
        if (match && match[1]) { return match[1].replace(/\+/g, ' '); }
        const response = await axios.head(url, { maxRedirects: 5 });
        const finalUrl = response.request.res.responseUrl;
        if (finalUrl) {
            decodedUrl = decodeURIComponent(finalUrl);
            match = decodedUrl.match(/maps\/place\/([^/]+)/);
            if (match && match[1]) { return match[1].replace(/\+/g, ' '); }
        }
    } catch (error) {
       console.warn(`解析網址時發生錯誤 (${error.message})，將使用原始輸入作為搜尋關鍵字`);
       return url;
    }
    return url;
}

async function main() {
    try {
        while (true) {
            const url = await rl.question('請貼上餐廳的 Google Maps 網址 (完成後按 Ctrl+C 結束): ');
            if (url) {
                const placeName = await parsePlaceNameFromUrl(url);
                await getRestaurantDetails(placeName);
            }
        }
    } catch (error) {
        console.log('\n程式已結束。');
        process.exit(0);
    }
}

console.log("--- NTU Eats 餐廳自動新增工具 ---");
main();