const fs = require('fs');
const path = require('path');

const SEED_DATA = [
  { id: 101, productName: 'Logic Pro Laptop', category: 'Electronics', price: 1200.00, supplier: 'Global Tech' },
  { id: 102, productName: 'Ergo Chair', category: 'Furniture', price: 299.99, supplier: 'Hardware Hub' },
  { id: 103, productName: 'Mechanical Keyboard', category: 'Electronics', price: 89.50, supplier: 'Global Tech' },
  { id: 104, productName: 'Standing Desk', category: 'Furniture', price: 450.00, supplier: 'Hardware Hub' },
  { id: 105, productName: 'A4 Paper Pack', category: 'Stationery', price: 15.00, supplier: 'Supply Chain Pro' },
  { id: 106, productName: 'Wireless Mouse', category: 'Electronics', price: 25.00, supplier: 'Global Tech' },
  { id: 107, productName: 'Smart Coffee Maker', category: 'Appliances', price: 149.99, supplier: 'Hardware Hub' },
  { id: 108, productName: 'Desk Lamp', category: 'Furniture', price: 45.00, supplier: 'Supply Chain Pro' },
  { id: 109, productName: 'Water Bottle', category: 'Stationery', price: 10.00, supplier: 'Supply Chain Pro' }
];

const DATA_DIR = path.join(__dirname, '..', 'backend', 'data');
const FILE_PATH = path.join(DATA_DIR, 'inventory.json');

console.log('[Search Project] Seeding inventory data...');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

try {
  fs.writeFileSync(FILE_PATH, JSON.stringify(SEED_DATA, null, 2));
  console.log(`- Created ${FILE_PATH}`);
  console.log(`- Seeded ${SEED_DATA.length} products.`);
} catch (err) {
  console.error('[Search Project] Error seeding data:', err.message);
  process.exit(1);
}
