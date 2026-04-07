const db = require('./connection');

const suppliers = [
  { name: 'Global Tech', city: 'San Jose' },
  { name: 'Hardware Hub', city: 'Austin' },
  { name: 'Supply Chain Pro', city: 'Chicago' },
];

const inventory = [
  { product_name: 'Workstation Laptop', quantity: 25, price: 1500.00, supplier_id: 1 },
  { product_name: 'Wireless Mouse', quantity: 150, price: 45.00, supplier_id: 1 },
  { product_name: '4K Monitor', quantity: 40, price: 350.00, supplier_id: 2 },
  { product_name: 'Mechanical Keyboard', quantity: 60, price: 120.00, supplier_id: 2 },
  { product_name: 'SSD 1TB', quantity: 100, price: 90.00, supplier_id: 3 },
  { product_name: 'RAM 16GB', quantity: 200, price: 65.00, supplier_id: 3 },
];

async function seed() {
  console.log('[DB Seed] Seeding sample data...');

  try {
    // 1. Insert Suppliers
    for (const s of suppliers) {
      await db.asyncRun('INSERT INTO suppliers (name, city) VALUES (?, ?)', [s.name, s.city]);
    }
    console.log(`- Inserted ${suppliers.length} suppliers`);

    // 2. Insert Inventory
    for (const item of inventory) {
      await db.asyncRun(
        'INSERT INTO inventory (supplier_id, product_name, quantity, price) VALUES (?, ?, ?, ?)',
        [item.supplier_id, item.product_name, item.quantity, item.price]
      );
    }
    console.log(`- Inserted ${inventory.length} inventory items`);

    console.log('[DB Seed] Done. Database populated.');
    process.exit(0);
  } catch (err) {
    console.error('[DB Seed] Error seeding database:', err.message);
    process.exit(1);
  }
}

seed();
