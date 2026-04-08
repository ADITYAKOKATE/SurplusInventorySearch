# 🚀 Surplus Inventory Ecosystem

Welcome to the **Surplus Inventory Ecosystem**, a comprehensive solution for managing and searching surplus stock across multiple suppliers. This monorepo contains two specialized projects that work together to provide a robust inventory management platform.

---

## 🏗️ Project Components

The ecosystem is divided into two primary modules, each serving a specific role in the inventory lifecycle:

### 1. [🗄️ Inventory Database API](./inventory-database-project/README.md)
**The Core Engine.** A database-backed REST API designed for high-integrity inventory management.
- **Key Features**: Supplier management, relational inventory tracking, grouped data analytics, and SQLite persistence.
- **Technologies**: Node.js, Express, SQLite.

### 2. [🔍 Inventory Find Search](./inventory-search-project/README.md)
**The User Portal.** A high-performance search interface and API built for rapid product discovery.
- **Key Features**: Real-time filtering by category and price, case-insensitive search, and a premium glassmorphism UI.
- **Technologies**: Node.js, Express, Vanilla JS, CSS Glassmorphism.

---

## 🚥 Quick Start

To get the entire system running, follow these general steps (see individual READMEs for detailed commands):

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/ADITYAKOKATE/SurplusInventorySearch.git
    cd SurplusInventorySearch
    ```

2.  **Setup Database API**:
    ```bash
    cd inventory-database-project
    npm install
    npm start
    ```

3.  **Setup Search Portal**:
    ```bash
    cd ../inventory-search-project
    npm install
    npm run db:setup
    npm start
    ```

---

## 📊 Ecosystem Overview

This project demonstrates a full-stack architecture, from low-level database indexing and relational schemas to high-level UI/UX design and complex search filtering.

- **Primary Repository**: [ADITYAKOKATE/SurplusInventorySearch](https://github.com/ADITYAKOKATE/SurplusInventorySearch)
- **License**: MIT
