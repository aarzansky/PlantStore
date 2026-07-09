const express = require('express');
const router = express.Router();
const {
  getAllPlants,
  getPlantById,
  getPlantsByCategory,
  createPlant,
  updatePlant,
  deletePlant,
} = require('../controllers/plantController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

// Public routes
router.get('/', getAllPlants);
router.get('/:id', getPlantById);
router.get('/category/:category', getPlantsByCategory);

// Private/Admin routes
router.post('/', protect, isAdmin, createPlant);
router.put('/:id', protect, isAdmin, updatePlant);
router.delete('/:id', protect, isAdmin, deletePlant);

module.exports = router;