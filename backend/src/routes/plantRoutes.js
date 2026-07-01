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

// Public routes
router.get('/', getAllPlants);
router.get('/:id', getPlantById);
router.get('/category/:category', getPlantsByCategory);

// Private/Admin routes (protect these later with admin middleware)
router.post('/', protect, createPlant);
router.put('/:id', protect, updatePlant);
router.delete('/:id', protect, deletePlant);

module.exports = router;