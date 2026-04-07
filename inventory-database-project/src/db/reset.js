const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DB_FILES = [
  'inventory.db',
  'inventory.db-shm',
  'inventory.db-wal'
];

console.log('[DB Reset] Clearing database files...');

let cleared = 0;
DB_FILES.forEach(file => {
  const filePath = path.join(DATA_DIR, file);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`- Deleted: ${file}`);
      cleared++;
    } catch (err) {
      console.error(`- Error deleting ${file}:`, err.message);
    }
  }
});

if (cleared === 0) {
  console.log('[DB Reset] No database files found to clear.');
} else {
  console.log(`[DB Reset] Done. Cleared ${cleared} file(s).`);
}
