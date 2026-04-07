const express = require('express');
const router = express.Router();
const { createInventory, getAllInventory, getGroupedBySupplier } = require('../controllers/inventoryController');

router.post('/', createInventory);
router.get('/grouped', getGroupedBySupplier);  // must be before /:id style routes
router.get('/', getAllInventory);

module.exports = router;
