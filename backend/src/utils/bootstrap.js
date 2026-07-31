const mongoose = require('mongoose');
const Category = require('../models/Category');
const Plant = require('../models/Plant');
const { DISCOUNTS_CATEGORY_NAME } = require('../constants');

// Creates the reserved "Discounts" category if it doesn't already exist, so the
// navbar's Discounts link always has somewhere real to filter by.
const ensureDiscountsCategory = async () => {
  const existing = await Category.findOne({
    name: new RegExp(`^${DISCOUNTS_CATEGORY_NAME}$`, 'i'),
  });
  if (!existing) {
    await Category.create({ name: DISCOUNTS_CATEGORY_NAME });
    console.log(`✅ Created reserved "${DISCOUNTS_CATEGORY_NAME}" category`);
  }
};

// Plants used to store a single `category` string. Now that a plant can belong
// to multiple categories, this moves any leftover legacy documents over to the
// new `categories` array automatically, so nothing needs a manual re-save.
const migrateLegacyPlantCategories = async () => {
  const plantsCollection = mongoose.connection.collection('plants');
  const legacyPlants = await plantsCollection
    .find({ categories: { $exists: false }, category: { $exists: true, $type: 'string' } })
    .toArray();

  if (legacyPlants.length === 0) return;

  const bulkOps = legacyPlants.map((plant) => ({
    updateOne: {
      filter: { _id: plant._id },
      update: { $set: { categories: [plant.category] }, $unset: { category: '' } },
    },
  }));

  await plantsCollection.bulkWrite(bulkOps);
  console.log(`✅ Migrated ${legacyPlants.length} plant(s) from "category" to "categories"`);
};

// Any plant that already has a discount but isn't tagged "Discounts" yet gets
// tagged automatically, so the navbar's Discounts link isn't empty for plants
// that were discounted before this category existed.
const tagDiscountedPlants = async () => {
  const result = await Plant.updateMany(
    { discountPercent: { $gt: 0 }, categories: { $ne: DISCOUNTS_CATEGORY_NAME } },
    { $addToSet: { categories: DISCOUNTS_CATEGORY_NAME } }
  );
  if (result.modifiedCount > 0) {
    console.log(`✅ Tagged ${result.modifiedCount} discounted plant(s) with "${DISCOUNTS_CATEGORY_NAME}"`);
  }
};

const runStartupTasks = async () => {
  try {
    await ensureDiscountsCategory();
    await migrateLegacyPlantCategories();
    await tagDiscountedPlants();
  } catch (error) {
    console.error('❌ Startup task error:', error);
  }
};

module.exports = { runStartupTasks };
