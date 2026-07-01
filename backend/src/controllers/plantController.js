const Plant = require('../models/Plant');

// @desc    Get all plants
// @route   GET /api/plants
// @access  Public
const getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find({});
    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single plant by ID
// @route   GET /api/plants/:id
// @access  Public
const getPlantById = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    res.json(plant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get plants by category
// @route   GET /api/plants/category/:category
// @access  Public
const getPlantsByCategory = async (req, res) => {
  try {
    const plants = await Plant.find({ category: req.params.category });
    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new plant (Admin only)
// @route   POST /api/plants
// @access  Private/Admin
const createPlant = async (req, res) => {
  try {
    const { name, category, price, description, imageUrl, stock } = req.body;

    const plant = await Plant.create({
      name,
      category,
      price,
      description,
      imageUrl,
      stock,
    });

    res.status(201).json(plant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update plant (Admin only)
// @route   PUT /api/plants/:id
// @access  Private/Admin
const updatePlant = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    const updatedPlant = await Plant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedPlant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete plant (Admin only)
// @route   DELETE /api/plants/:id
// @access  Private/Admin
const deletePlant = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    await plant.deleteOne();
    res.json({ message: 'Plant removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPlants,
  getPlantById,
  getPlantsByCategory,
  createPlant,
  updatePlant,
  deletePlant,
};