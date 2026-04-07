const db = require('../db/connection');

// ─── POST /inventory ───────────────────────────────────────────────────────────
const createInventory = async (req, res) => {
  const { supplier_id, product_name, quantity, price } = req.body;

  // Field presence checks
  if (supplier_id === undefined || supplier_id === null || supplier_id === '') {
    return res.status(400).json({ error: true, message: 'supplier_id is required' });
  }
  if (!product_name || product_name.trim() === '') {
    return res.status(400).json({ error: true, message: 'product_name is required' });
  }
  if (quantity === undefined || quantity === null || quantity === '') {
    return res.status(400).json({ error: true, message: 'quantity is required' });
  }
  if (price === undefined || price === null || price === '') {
    return res.status(400).json({ error: true, message: 'price is required' });
  }

  const numQuantity = Number(quantity);
  const numPrice    = Number(price);

  // Business rule validation
  if (isNaN(numQuantity) || !Number.isInteger(numQuantity)) {
    return res.status(400).json({ error: true, message: 'quantity must be a whole number' });
  }
  if (numQuantity < 0) {
    return res.status(400).json({ error: true, message: 'quantity must be 0 or more' });
  }
  if (isNaN(numPrice)) {
    return res.status(400).json({ error: true, message: 'price must be a valid number' });
  }
  if (numPrice <= 0) {
    return res.status(400).json({ error: true, message: 'price must be greater than 0' });
  }

  try {
    // Validate supplier existence
    const supplier = await db.asyncGet('SELECT * FROM suppliers WHERE id = ?', [Number(supplier_id)]);
    if (!supplier) {
      return res.status(400).json({
        error: true,
        message: `Invalid supplier_id: No supplier found with id ${supplier_id}`
      });
    }

    // Insert inventory record
    const result = await db.asyncRun(
      'INSERT INTO inventory (supplier_id, product_name, quantity, price) VALUES (?, ?, ?, ?)',
      [Number(supplier_id), product_name.trim(), numQuantity, numPrice]
    );

    const newItem = await db.asyncGet('SELECT * FROM inventory WHERE id = ?', [result.lastID]);

    return res.status(201).json({
      message: 'Inventory item created successfully',
      item: newItem
    });
  } catch (err) {
    return res.status(500).json({ error: true, message: 'Failed to create inventory item', detail: err.message });
  }
};

// ─── GET /inventory ────────────────────────────────────────────────────────────
const getAllInventory = async (req, res) => {
  try {
    const items = await db.asyncAll(`
      SELECT
        i.id,
        i.product_name,
        i.quantity,
        i.price,
        i.supplier_id,
        s.name  AS supplier_name,
        s.city  AS supplier_city,
        ROUND(i.quantity * i.price, 2) AS total_value
      FROM inventory i
      JOIN suppliers s ON i.supplier_id = s.id
      ORDER BY i.id ASC
    `);
    return res.status(200).json({ count: items.length, items });
  } catch (err) {
    return res.status(500).json({ error: true, message: 'Failed to fetch inventory', detail: err.message });
  }
};

// ─── GET /inventory/grouped ────────────────────────────────────────────────────
const getGroupedBySupplier = async (req, res) => {
  try {
    const grouped = await db.asyncAll(`
      SELECT
        s.id                                    AS supplier_id,
        s.name                                  AS supplier_name,
        s.city                                  AS supplier_city,
        COUNT(i.id)                             AS item_count,
        SUM(i.quantity)                         AS total_quantity,
        ROUND(SUM(i.quantity * i.price), 2)     AS total_inventory_value
      FROM suppliers s
      JOIN inventory i ON s.id = i.supplier_id
      GROUP BY s.id, s.name, s.city
      ORDER BY total_inventory_value DESC
    `);

    return res.status(200).json({
      message: 'Inventory grouped by supplier, sorted by total value (descending)',
      count: grouped.length,
      grouped
    });
  } catch (err) {
    return res.status(500).json({ error: true, message: 'Failed to fetch grouped inventory', detail: err.message });
  }
};

module.exports = { createInventory, getAllInventory, getGroupedBySupplier };
