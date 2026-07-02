import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import AdminLayout from '../components/AdminLayout';
import './AdminPlants.css';

function AdminPlants() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    imageUrl: '',
    stock: '',
  });

  const categories = [
    'Indoor Plants',
    'Outdoor Plants',
    'Succulents',
    'Flowering Plants',
    'Aquatic Plants',
    'Creepers',
    'Fruits',
    'Pots',
    'Plant Care'
  ];

  useEffect(() => {
    fetchPlants();
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlant) {
        await adminAPI.updatePlant(editingPlant._id, formData);
        alert('Plant updated successfully!');
      } else {
        await adminAPI.createPlant(formData);
        alert('Plant added successfully!');
      }
      resetForm();
      fetchPlants();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving plant');
    }
  };

  const handleEdit = (plant) => {
    setEditingPlant(plant);
    setFormData({
      name: plant.name,
      category: plant.category,
      price: plant.price,
      description: plant.description,
      imageUrl: plant.imageUrl || '',
      stock: plant.stock,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this plant?')) {
      try {
        await adminAPI.deletePlant(id);
        alert('Plant deleted successfully!');
        fetchPlants();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting plant');
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingPlant(null);
    setFormData({
      name: '',
      category: '',
      price: '',
      description: '',
      imageUrl: '',
      stock: '',
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
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
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
              <div className="plant-card-body">
                <h3>{plant.name}</h3>
                <p className="plant-category">{plant.category}</p>
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