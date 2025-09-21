# NTU Eats | 台大吃什麼

\<div align="center"\>
\<img width="1200" height="475" alt="專案橫幅" src="[https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)" /\>
\</div\>

一個幫助您解決「今天在台大附近要吃什麼？」煩惱的 Web 應用程式。

**[➡️ 立即體驗](https://ntu-eats.pages.dev/)**

## ✨ 功能特色

  * **🚀 快速篩選**：根據餐廳名稱或菜系快速搜尋。
  * **⚙️ 多維度過濾**：支援依據價位、Google Maps 評分、與您的距離、是否正在營業等多種條件篩選餐廳。
  * **📍 即時距離**：自動取得您的地理位置，計算每家餐廳與您的實際距離（需要您授權定位權限）。
  * **🎲 懶人隨機選**：選擇困難嗎？讓「懶人隨機選」功能為您挑選三家符合條件的餐廳！
  * **🕒 營業狀態**：在餐廳卡片上清楚標示「營業中」或「休息中」，避免您白跑一趟。
  * **🗺️ Google Maps 整合**：點擊按鈕即可直接在新分頁開啟餐廳的 Google Maps 頁面。

## 🛠️ 技術棧

  * **前端框架**: React
  * **語言**: TypeScript
  * **建置工具**: Vite
  * **樣式**: Tailwind CSS

## 🚀 在本地端運行

### 環境需求

  * Node.js (建議版本 \>= 18.0.0)
  * npm (或 pnpm / yarn)

### 安裝與啟動

1.  **複製專案**

    ```bash
    git clone https://github.com/siqunchen/ntu-eats.git
    cd ntu-eats
    ```

2.  **安裝依賴套件**

    ```bash
    npm install
    ```

3.  **啟動本地開發伺服器**

    ```bash
    npm run dev
    ```

4.  在瀏覽器中開啟 `http://localhost:5173` (或 Vite 提示的網址)。

## 📝 新增餐廳資料

本專案提供一個互動式腳本，可以透過 Google Maps 網址自動抓取餐廳資訊並新增至資料庫。

### 環境需求

  * 您需要一組 **Google Maps Place API Key**。

### 操作步驟

1.  在專案根目錄下，設定您的 Google Maps API 金鑰為環境變數。您可以將其加入 `.env` 檔案中：

    ```
    GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY"
    ```

2.  執行新增餐廳的腳本：

    ```bash
    node scripts/addRestaurant.js
    ```

3.  根據終端機的提示，貼上您想新增餐廳的 Google Maps 網址，腳本將會自動抓取資訊、讓您選擇菜系分類，最後將格式化後的資料加入到 `public/services/data.json`。