import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './App.css';

// Pages
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import PlantsPage from './pages/PlantsPage';
import PlantDetailPage from './pages/PlantDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import KhaltiCallbackPage from './pages/KhaltiCallbackPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderReceiptPage from './pages/OrderReceiptPage';
import ProfilePage from './pages/ProfilePage';
import StaticPage from './pages/StaticPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import AboutPage from './pages/AboutPage';
import UserGuidesPage from './pages/UserGuidesPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminPlants from './pages/AdminPlants';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';
import AdminOrderDetail from './pages/AdminOrderDetail';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/plants" element={<PlantsPage />} />
            <Route path="/plant/:id" element={<PlantDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment/khalti/callback" element={<KhaltiCallbackPage />} />
            <Route path="/orders" element={<MyOrdersPage />} />
            <Route path="/orders/:id" element={<OrderReceiptPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Footer placeholder pages - simple static pages for now */}
            <Route path="/accessories" element={<StaticPage title="Accessories" description="Pots, tools, and plant accessories are on their way." />} />
            <Route path="/gifts" element={<StaticPage title="Gifts" description="Plant gift sets and bundles are coming soon." />} />
            <Route path="/seeds" element={<StaticPage title="Seeds" description="Our seed collection is being planted - check back soon." />} />
            <Route path="/guides" element={<UserGuidesPage />} />
            <Route path="/blog" element={<StaticPage title="Blog" description="Plant stories and tips from our team, coming soon." />} />
            <Route path="/faqs" element={<FAQPage />} />
            <Route path="/plant-care" element={<StaticPage title="Plant Care" description="Care tips to keep your plants thriving are coming soon." />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/plants" element={<AdminPlants />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
