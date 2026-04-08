# InventoryFind — Inventory Search API + UI

A surplus product search system that lets buyers quickly filter inventory from multiple suppliers by name, category, and price range. Built with Node.js + Express on the backend and plain HTML/CSS/JavaScript on the frontend.

---

## Screenshots

![Search results — Electronics category filtered](../../../../../../../Users/Aditya/.gemini/antigravity/brain/8440fa72-edfa-4ddf-89a6-d327f908ad2f/part_a_search_results_1775581035867.png)

*Filtering by category "Electronics" with a price range*

![No results state](../../../../../../../Users/Aditya/.gemini/antigravity/brain/8440fa72-edfa-4ddf-89a6-d327f908ad2f/part_a_no_results_1775581082579.png)

*"No results found" state when search returns an empty array*

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Node.js + Express |
| **Data** | Static JSON file (15 records, in-memory at runtime) |
| **Frontend** | HTML5, Vanilla CSS, Vanilla JavaScript |
| **Font** | Inter (Google Fonts) |
| **API style** | REST — single `GET /search` endpoint |
| **Runtime** | Node.js ≥ 18 |

---

## Features

- **Product name search** — partial match, fully case-insensitive
- **Category filter** — dropdown with all 5 categories (Furniture, Electronics, Stationery, Office Supplies, Appliances)
- **Price range filter** — min price and max price, inclusive
- **Combined filters** — all filters work together in a single request
- **Input validation** — returns `400` with a clear message if `minPrice > maxPrice`
- **Empty state** — "No results found" message when the array is empty
- **Reset button** — clears all filters and resets the UI
- **Enter key support** — press Enter in any input to trigger search
- **Auto-search on category change** — after first search, changing the category re-searches automatically
- **Fully responsive** — works on mobile, tablet, and desktop
- **Express serves frontend** — single server handles both API and UI (no CORS setup needed)

---

## Project Structure

```
inventory-search-project/
├── package.json       ← Root manager (scripts: start, dev, db:setup)
├── scripts/
│   └── seed.js        ← Data generation script
├── backend/
│   ├── package.json
│   ├── server.js      ← Express server + /search API
│   └── data/
│       └── inventory.json
└── frontend/
    ├── index.html     ← UI layout
    ├── style.css      ← Light theme styling
    └── script.js      ← Fetch, render, state handling
```

---

## Available Scripts

From the **root directory**, you can run:

| Command | Action |
|:---|:---|
| `npm install` | Installs root and backend dependencies. |
| `npm start` | **Production** — Runs the server (serves frontend + API). |
| `npm run dev` | **Development** — Runs with `nodemon` for auto-reloading. |
| `npm run db:setup` | **Setup** — Generates a fresh `inventory.json` with sample data. |

---

## How to Run Locally

### Prerequisites

- **Node.js** v18 or higher → [Download](https://nodejs.org)
- A terminal (Command Prompt, PowerShell, or bash)

### Steps

**1. Clone or download the project**

```bash
git clone https://github.com/YOUR_USERNAME/inventory-search-project.git
cd inventory-search-project
```

**2. Install and Setup**

```bash
npm install
npm run db:setup
```

**3. Start the server**

```bash
npm start
```

**4. Open the app**

Open your browser and visit: `http://localhost:3000`

The same server serves both the frontend UI and the `/search` API — fully ready for deployment to any Node.js host.

---

## API Reference

### `GET /search`

| Parameter | Type | Description |
|---|---|---|
| `q` | string | Product name — partial, case-insensitive |
| `category` | string | Exact category match (case-insensitive) |
| `minPrice` | number | Minimum price (inclusive) |
| `maxPrice` | number | Maximum price (inclusive) |

**Example requests:**

```
GET http://localhost:3000/search
GET http://localhost:3000/search?q=chair
GET http://localhost:3000/search?category=Electronics
GET http://localhost:3000/search?minPrice=50&maxPrice=200
GET http://localhost:3000/search?q=desk&category=Furniture&minPrice=100&maxPrice=400
```

**Success response (200):**
```json
{
  "count": 1,
  "results": [
    {
      "id": 1,
      "productName": "Office Chair",
      "category": "Furniture",
      "price": 120,
      "supplier": "ABC Traders"
    }
  ]
}
```

**Error — invalid price range (400):**
```json
{
  "error": true,
  "message": "Invalid price range: minPrice cannot be greater than maxPrice"
}
```

---

## Sample Data Overview

| Category | Items |
|---|---|
| Furniture | Office Chair, Standing Desk, Bookshelf |
| Electronics | Laptop, Wireless Mouse, Mechanical Keyboard, 27-inch Monitor |
| Stationery | Ball Pen Pack, Spiral Notebook, Sticky Notes Set |
| Office Supplies | Whiteboard Marker Set, Stapler, File Cabinet |
| Appliances | Coffee Maker, Air Purifier |
