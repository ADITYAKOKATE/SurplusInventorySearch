const db = require('../db/connection');

// ─── POST /supplier ────────────────────────────────────────────────────────────
const createSupplier = async (req, res) => {
  const { name, city } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: true, message: 'Supplier name is required' });
  }
  if (!city || city.trim() === '') {
    return res.status(400).json({ error: true, message: 'Supplier city is required' });
  }

  try {
    const result = await db.asyncRun(
      'INSERT INTO suppliers (name, city) VALUES (?, ?)',
      [name.trim(), city.trim()]
    );
    const newSupplier = await db.asyncGet('SELECT * FROM suppliers WHERE id = ?', [result.lastID]);

    return res.status(201).json({
      message: 'Supplier created successfully',
      supplier: newSupplier
    });
  } catch (err) {
    return res.status(500).json({ error: true, message: 'Failed to create supplier', detail: err.message });
  }
};

// ─── GET /suppliers ────────────────────────────────────────────────────────────
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await db.asyncAll('SELECT * FROM suppliers ORDER BY id ASC');
    return res.status(200).json({ count: suppliers.length, suppliers });
  } catch (err) {
    return res.status(500).json({ error: true, message: 'Failed to fetch suppliers', detail: err.message });
  }
};

module.exports = { createSupplier, getAllSuppliers };
