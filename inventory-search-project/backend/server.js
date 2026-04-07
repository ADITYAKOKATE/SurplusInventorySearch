const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend static files from ../frontend/dist (Vite build output)
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// Load inventory data once at startup
const inventoryData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'inventory.json'), 'utf-8')
);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    service: 'Inventory Search API',
    status: 'running',
    endpoints: {
      'GET /search': 'Search inventory with query params (q, category, minPrice, maxPrice)'
    }
  });
});

// ─── GET /search ──────────────────────────────────────────────────────────────
app.get('/search', (req, res) => {
  const { q, category, minPrice, maxPrice } = req.query;

  // Validate price range before filtering
  if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
    return res.status(400).json({
      error: true,
      message: 'Invalid price range: minPrice cannot be greater than maxPrice'
    });
  }

  let results = [...inventoryData];

  // 1. Product name filter — case-insensitive partial match
  if (q && q.trim() !== '') {
    const query = q.trim().toLowerCase();
    results = results.filter(item =>
      item.productName.toLowerCase().includes(query)
    );
  }

  // 2. Category filter — case-insensitive exact match
  if (category && category.trim() !== '') {
    const cat = category.trim().toLowerCase();
    results = results.filter(item =>
      item.category.toLowerCase() === cat
    );
  }

  // 3. Minimum price filter
  if (minPrice !== undefined && minPrice !== '') {
    const min = Number(minPrice);
    if (!isNaN(min)) {
      results = results.filter(item => item.price >= min);
    }
  }

  // 4. Maximum price filter
  if (maxPrice !== undefined && maxPrice !== '') {
    const max = Number(maxPrice);
    if (!isNaN(max)) {
      results = results.filter(item => item.price <= max);
    }
  }

  return res.status(200).json({
    count: results.length,
    results
  });
});

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: true, message: 'Route not found' });
});

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[Inventory Search] Server running on port ${PORT}`);
});
