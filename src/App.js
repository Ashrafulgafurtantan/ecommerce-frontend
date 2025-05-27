import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderHistory from './components/OrderHistory';
import 'bootstrap/dist/css/bootstrap.min.css';

const PrivateRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user.userType !== 'admin') {
    return <Navigate to="/home" />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/home" 
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route 
        path="/admin" 
        element={
          <PrivateRoute requireAdmin>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route path="/cart" element={<Cart />} />
      <Route 
        path="/checkout" 
        element={
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        }
      />
      <Route 
        path="/order-history" 
        element={
          <PrivateRoute>
            <OrderHistory />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/home" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppRoutes />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
