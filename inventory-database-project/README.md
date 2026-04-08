# 🗄️ Inventory Database API

A database-backed inventory management REST API built with Node.js, Express, and SQLite. Supports creating suppliers and inventory items, fetching all inventory with supplier details, and running a grouped query that ranks suppliers by their total stock value.

---

## 📸 Screenshots

![Inventory grouped by supplier — API response](./images/Screenshot%202026-04-08%20153934.png)

*`GET /inventory/grouped` — Suppliers ranked by total inventory value*

![Creating an inventory item](./images/Screenshot%202026-04-08%20153948.png)

*`POST /inventory` — Creating a new item with validation*

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Node.js + Express |
| **Database** | SQLite (via `sqlite3` npm package) |
| **DB location** | `data/inventory.db` (auto-created on startup) |
| **Schema init** | `src/db/schema.sql` (runs automatically) |
| **API style** | REST |
| **Runtime** | Node.js ≥ 18 |

### Why SQLite?

The supplier → inventory relationship is clearly **relational** — one supplier owns many items. SQL foreign keys enforce this at the database level. SQLite requires zero external configuration and stores the entire database in a single file, making it ideal for this project's scale and easy to run locally without any database server.

---

## Features

- **Create suppliers** — `POST /supplier` with name and city
- **Create inventory items** — `POST /inventory` linked to a supplier
- **Full validation**:
  - `quantity` must be an integer `≥ 0`
  - `price` must be a number `> 0`
  - `supplier_id` must exist in the database (FK enforced at both controller and DB level)
  - Friendly `400` error messages for all failures
- **List all inventory** — `GET /inventory` returns items joined with supplier name and city, plus per-item total value
- **Grouped query** — `GET /inventory/grouped` returns suppliers ranked by `SUM(quantity × price)` descending
- **Health endpoint** — `GET /` lists all available routes
- **Auto DB init** — schema and tables are created automatically on first run

---

## Database Schema

```sql
CREATE TABLE suppliers (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT    NOT NULL,
  city TEXT    NOT NULL
);

CREATE TABLE inventory (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_id  INTEGER NOT NULL,
  product_name TEXT    NOT NULL,
  quantity     INTEGER NOT NULL CHECK(quantity >= 0),
  price        REAL    NOT NULL CHECK(price > 0),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- Performance index
CREATE INDEX idx_inventory_supplier_id ON inventory(supplier_id);
```

**Relationship:** One supplier → many inventory items (1:N)

---

## Project Structure

```
inventory-database-project/
├── .gitignore
├── README.md
├── package.json
├── data/
│   ├── .gitkeep           ← Keeps folder in git; DB file is excluded
│   └── inventory.db       ← Auto-created on first run (gitignored)
└── src/
    ├── server.js           ← Express app + routes + error handlers
    ├── db/
    │   ├── schema.sql      ← Table definitions
    │   └── connection.js   ← SQLite connection + schema init + helpers
    ├── routes/
    │   ├── supplierRoutes.js
    │   └── inventoryRoutes.js
    └── controllers/
        ├── supplierController.js
        └── inventoryController.js
```

---

## How to Run Locally

### Prerequisites

- **Node.js** v18 or higher → [Download](https://nodejs.org)
- **Postman** (recommended for testing) → [Download](https://www.postman.com/downloads/) or use `curl`

### Steps

**1. Clone or download the project**

```bash
git clone https://github.com/YOUR_USERNAME/inventory-database-project.git
cd inventory-database-project
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the server**

```bash
npm start
```

You'll see:
```
[Inventory DB API] Server running on port 4000
[DB] Connected to SQLite
```

The database file is created automatically at `data/inventory.db`.

**4. Test the API**

Visit `http://localhost:4000` in your browser to see a list of all available routes.

---

## API Reference

### `POST /supplier` — Create a supplier

```http
POST http://localhost:4000/supplier
Content-Type: application/json

{
  "name": "ABC Traders",
  "city": "Mumbai"
}
```

**Response 201:**
```json
{ "message": "Supplier created successfully", "supplier": { "id": 1, "name": "ABC Traders", "city": "Mumbai" } }
```

---

### `GET /suppliers` — List all suppliers

```http
GET http://localhost:4000/suppliers
```

---

### `POST /inventory` — Add an inventory item

```http
POST http://localhost:4000/inventory
Content-Type: application/json

{
  "supplier_id": 1,
  "product_name": "Office Chair",
  "quantity": 50,
  "price": 120.00
}
```

**Response 201:**
```json
{ "message": "Inventory item created successfully", "item": { "id": 1, ... } }
```

**Validation errors (400):**
```json
{ "error": true, "message": "quantity must be 0 or more" }
{ "error": true, "message": "price must be greater than 0" }
{ "error": true, "message": "Invalid supplier_id: No supplier found with id 99" }
```

---

### `GET /inventory` — List all items

```http
GET http://localhost:4000/inventory
```

Returns all items with `supplier_name`, `supplier_city`, and `total_value` (quantity × price) per item.

---

### `GET /inventory/grouped` — Grouped by supplier

```http
GET http://localhost:4000/inventory/grouped
```

**Response:**
```json
{
  "grouped": [
    {
      "supplier_id": 2,
      "supplier_name": "TechZone Ltd",
      "supplier_city": "Pune",
      "item_count": 3,
      "total_quantity": 200,
      "total_inventory_value": 85000.00
    }
  ]
}
```

Sorted by `total_inventory_value` descending using:
```sql
SELECT s.name, SUM(i.quantity * i.price) AS total_inventory_value
FROM suppliers s JOIN inventory i ON s.id = i.supplier_id
GROUP BY s.id ORDER BY total_inventory_value DESC;
```

---

## Performance Optimization

The schema includes an **index on `supplier_id`**:

```sql
CREATE INDEX idx_inventory_supplier_id ON inventory(supplier_id);
```

This speeds up the `JOIN` in the grouped query from `O(n)` full-table scan to `O(log n)` — critical as inventory rows grow into thousands.
