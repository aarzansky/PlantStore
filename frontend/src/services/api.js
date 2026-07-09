import axios from 'axios';

// Create axios instance with base URL
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
};

// Plants API calls
export const plantsAPI = {
  getAll: () => api.get('/plants'),
  getById: (id) => api.get(`/plants/${id}`),
  getByCategory: (category) => api.get(`/plants/category/${category}`),
};

// Orders API calls
export const ordersAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};

// Admin API calls - ADD THIS SECTION
export const adminAPI = {
  // Dashboard
  getStats: () => api.get('/admin/stats'),
  
  // Plant Management
  getPlants: () => api.get('/admin/plants'),
  createPlant: (plantData) => api.post('/admin/plants', plantData),
  updatePlant: (id, plantData) => api.put(`/admin/plants/${id}`, plantData),
  deletePlant: (id) => api.delete(`/admin/plants/${id}`),
  
  // User Management
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  makeAdmin: (id) => api.put(`/admin/users/${id}/make-admin`),
  
  // Order Management
  getOrders: () => api.get('/admin/orders'),
  getOrderById: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
  deleteOrder: (id) => api.delete(`/admin/orders/${id}`),
};

export default api;