const express = require('express');
const supplierRoutes = require('./routes/supplierRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    service: 'Inventory Database API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      'POST /supplier':         'Create a new supplier',
      'GET  /suppliers':        'List all suppliers',
      'POST /inventory':        'Add an inventory item',
      'GET  /inventory':        'List all inventory items',
      'GET  /inventory/grouped':'Inventory grouped by supplier, sorted by total value'
    }
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/supplier', supplierRoutes);
app.use('/suppliers', supplierRoutes);
app.use('/inventory', inventoryRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: true, message: `Route ${req.method} ${req.path} not found` });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(500).json({ error: true, message: 'Internal server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[Inventory DB API] Server running on port ${PORT}`);
});
