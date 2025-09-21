// scripts/addRestaurant.js

import axios from 'axios';
import readline from 'readline/promises';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url'; // 【修正】引入 fileURLToPath

// 從環境變數讀取您的 API 金鑰
const { GOOGLE_MAPS_API_KEY } = process.env;

if (!GOOGLE_MAPS_API_KEY) {
    console.error('錯誤：請設定 GOOGLE_MAPS_API_KEY 環境變數');
    process.exit(1);
}

// 【修正】使用更穩健的方式取得目前檔案的路徑
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, '..', 'public', 'services', 'data.json');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,geometry,price_level,url,types&key=${GOOGLE_MAPS_API_KEY}`;
        const detailsResponse = await axios.get(detailsUrl);
        if (detailsResponse.data.status !== 'OK') {
            throw new Error('無法取得地點的詳細資訊');
        }
        const place = detailsResponse.data.result;

        // --- 讀取並解析現有的 data.json ---
        const dataFile = await fs.readFile(dataFilePath, 'utf8');
        
        // 【防錯】如果檔案是空的，就初始化為一個空陣列
        const restaurants = dataFile ? JSON.parse(dataFile) : [];

        // --- 檢查是否重複 ---
        const isDuplicate = restaurants.some(r => r.name === place.name || r.googleMapsUrl === place.url);
        if (isDuplicate) {
            console.warn(`\n⚠️  警告：餐廳 "${place.name}" 已經存在於 data.json 中，將不會重複新增。`);
            return;
        }

        // --- 產生新的餐廳物件 ---
        // 如果 restaurants 是空的，起始 id 為 1
        const newId = restaurants.length > 0 ? Math.max(...restaurants.map(r => r.id)) + 1 : 1;

        const newRestaurant = {
            id: newId,
            name: place.name,
            cuisine: findCuisine(place.types),
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            priceRange: place.price_level || 2,
            rating: place.rating,
            googleMapsUrl: place.url
        };

        // --- 將新餐廳加入陣列並寫回檔案 ---
        restaurants.push(newRestaurant);
        await fs.writeFile(dataFilePath, JSON.stringify(restaurants, null, 4), 'utf8');
        
        console.log(`\n✅ 成功！餐廳 "${place.name}" 已自動新增到 public/services/data.json 中！`);
        console.log('\n----------------------------------------\n');

    } catch (error) {
        // 加上對 JSON 解析錯誤的具體提示
        if (error instanceof SyntaxError) {
            console.error('\n❌ 發生錯誤：data.json 檔案格式錯誤，無法解析。請檢查檔案內容是否為有效的 JSON。');
        } else {
            console.error('\n❌ 發生錯誤：', error.message);
        }
    }
}

function findCuisine(types) {
    // 優先檢查最精確的菜系分類
    if (types.includes('thai_restaurant')) return '泰式';
    if (types.includes('japanese_restaurant')) return '日式';
    if (types.includes('italian_restaurant')) return '義式';
    if (types.includes('american_restaurant')) return '美式';
    if (types.includes('chinese_restaurant')) return '中式';
    if (types.includes('vietnamese_restaurant')) return '越南料理';
    // 您可以在這裡繼續添加更多精確的菜系，例如 'mexican_restaurant', 'indian_restaurant' 等

    // 如果上面都沒有符合，再檢查通用的分類
    const typeMap = {
        'cafe': '咖啡廳',
        'bakery': '麵包店',
        'bar': '酒吧',
        'meal_takeaway': '外帶',
        // 將 'restaurant' 放在通用分類的後面，作為一個比較概括的選項
        'restaurant': '複合式', 
    };

    for (const type of types) {
        if (typeMap[type]) {
            return typeMap[type];
        }
    }

    // 如果所有標籤都對應不到，最後回傳'其他'
    return '其他';
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
    const url = await rl.question('請貼上餐廳的 Google Maps 網址 (完成後按 Ctrl+C 結束): ');
    if (url) {
        const placeName = await parsePlaceNameFromUrl(url);
        await getRestaurantDetails(placeName);
    }
    main(); 
}

console.log("--- NTU Eats 餐廳自動新增工具 ---");
main();