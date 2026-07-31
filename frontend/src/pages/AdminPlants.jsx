import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminAPI, categoriesAPI } from '../services/api';
import AdminLayout from '../components/AdminLayout';
import './AdminPlants.css';

function AdminPlants() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    categories: [],
    price: '',
    description: '',
    imageUrl: '',
    stock: '',
    discountPercent: '',
  });

  // Full category objects ({_id, name}) so we can delete by id...
  const [categoriesList, setCategoriesList] = useState([]);
  // ...and just the names, for the plant form's <select>
  const categories = categoriesList.map((cat) => cat.name);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');

  useEffect(() => {
    fetchPlants();
    fetchCategories();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await adminAPI.getPlants();
      setPlants(response.data.plants);
    } catch (error) {
      console.error('Error fetching plants:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategoriesList(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      setCategoryError('');
      await categoriesAPI.create(newCategoryName.trim());
      setNewCategoryName('');
      fetchCategories();
    } catch (error) {
      setCategoryError(error.response?.data?.message || 'Error adding category');
    }
  };

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    try {
      setCategoryError('');
      await categoriesAPI.delete(category._id);
      fetchCategories();
    } catch (error) {
      setCategoryError(error.response?.data?.message || 'Error deleting category');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryToggle = (categoryName) => {
    setFormData((prev) => {
      const alreadySelected = prev.categories.includes(categoryName);
      return {
        ...prev,
        categories: alreadySelected
          ? prev.categories.filter((name) => name !== categoryName)
          : [...prev.categories, categoryName],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.categories.length === 0) {
      toast.error('Select at least one category');
      return;
    }
    try {
      if (editingPlant) {
        await adminAPI.updatePlant(editingPlant._id, formData);
        toast.success('Plant updated successfully!');
      } else {
        await adminAPI.createPlant(formData);
        toast.success('Plant added successfully!');
      }
      resetForm();
      fetchPlants();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving plant');
    }
  };

  const handleEdit = (plant) => {
    setEditingPlant(plant);
    setFormData({
      name: plant.name,
      categories: plant.categories || [],
      price: plant.price,
      description: plant.description,
      imageUrl: plant.imageUrl || '',
      stock: plant.stock,
      discountPercent: plant.discountPercent || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this plant?')) {
      try {
        await adminAPI.deletePlant(id);
        toast.success('Plant deleted successfully!');
        fetchPlants();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error deleting plant');
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingPlant(null);
    setFormData({
      name: '',
      categories: [],
      price: '',
      description: '',
      imageUrl: '',
      stock: '',
      discountPercent: '',
    });
  };

  if (loading) return <div className="loading">Loading plants...</div>;

  return (
    <AdminLayout>
      <div className="admin-plants">
        <div className="admin-header">
          <h1>Manage Plants</h1>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + Add New Plant
          </button>
        </div>

        <div className="category-manager">
          <h2>Categories</h2>
          <form className="category-add-form" onSubmit={handleAddCategory}>
            <input
              type="text"
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <button type="submit" className="btn-secondary">Add Category</button>
          </form>
          {categoryError && <p className="category-error">{categoryError}</p>}
          <div className="category-pills">
            {categoriesList.map((category) => (
              <span className="category-pill" key={category._id}>
                {category.name}
                <button
                  type="button"
                  className="category-pill-remove"
                  onClick={() => handleDeleteCategory(category)}
                  aria-label={`Delete ${category.name}`}
                >
                  ×
                </button>
              </span>
            ))}
            {categoriesList.length === 0 && (
              <p className="category-empty">No categories yet — add one above.</p>
            )}
          </div>
        </div>

        {showForm && (
          <div className="modal-overlay" onClick={resetForm}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingPlant ? 'Edit Plant' : 'Add New Plant'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Plant Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Categories</label>
                  <div className="category-checkboxes">
                    {categories.length === 0 ? (
                      <p className="form-hint">Add a category above first.</p>
                    ) : (
                      categories.map((cat) => (
                        <label key={cat} className="category-checkbox">
                          <input
                            type="checkbox"
                            checked={formData.categories.includes(cat)}
                            onChange={() => handleCategoryToggle(cat)}
                          />
                          {cat}
                        </label>
                      ))
                    )}
                  </div>
                  <p className="form-hint">
                    Select every category this plant belongs to. Tag it "Discounts" to have it show up
                    from the navbar's Discounts link.
                  </p>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (Rs.)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="form-group">
                  <label>Discount (%)</label>
                  <input
                    type="number"
                    name="discountPercent"
                    value={formData.discountPercent}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    placeholder="0"
                  />
                  <p className="form-hint">
                    Set above 0 to feature this plant in the Discounts section on the landing page.
                  </p>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    {editingPlant ? 'Update Plant' : 'Add Plant'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="plants-grid-admin">
          {plants.map((plant) => (
            <div className="plant-card-admin" key={plant._id}>
              <img src={plant.imageUrl} alt={plant.name} />
              {plant.discountPercent > 0 && (
                <span className="plant-discount-badge">{plant.discountPercent}% OFF</span>
              )}
              <div className="plant-card-body">
                <h3>{plant.name}</h3>
                <p className="plant-category">{(plant.categories || []).join(', ')}</p>
                <p className="plant-price">Rs.{plant.price}</p>
                <p className="plant-stock">Stock: {plant.stock}</p>
                <div className="plant-actions">
                  <button className="btn-edit" onClick={() => handleEdit(plant)}>
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(plant._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminPlants;