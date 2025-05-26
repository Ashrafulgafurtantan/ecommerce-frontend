import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Badge } from 'reactstrap';
import { getCart, removeFromCart, updateCartItemQuantity } from '../utils/dataUtils';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const items = getCart();
    setCartItems(items);
    calculateTotal(items);
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(total);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = updateCartItemQuantity(productId, newQuantity);
    if (updatedCart) {
      setCartItems(updatedCart);
      calculateTotal(updatedCart);
    }
  };

  const handleRemove = (productId) => {
    const updatedCart = removeFromCart(productId);
    setCartItems(updatedCart);
    calculateTotal(updatedCart);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
        <div className="text-center">
          <i className="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
          <h2>Your cart is empty</h2>
          <p className="text-muted mb-4">Your shopping cart is currently empty.</p>
          <Button color="primary" onClick={() => navigate('/home')} className="px-4">
            <i className="fas fa-arrow-left me-1"></i> Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Container className="mt-4">
        <h2 className="mb-4">Shopping Cart</h2>
        <div className="table-responsive">
          <Table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.productId}>
                  <td>
                    <h5 className="mb-0">{item.name}</h5>
                    <small className="text-muted">{item.unit}</small>
                  </td>
                  <td className="product-price">${item.price}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <Button 
                        color="secondary" 
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <i className="fas fa-minus"></i>
                      </Button>
                      <Badge color="primary" className="mx-2">{item.quantity}</Badge>
                      <Button 
                        color="secondary" 
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      >
                        <i className="fas fa-plus"></i>
                      </Button>
                    </div>
                  </td>
                  <td>{item.unit}</td>
                  <td className="product-price">${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <Button 
                      color="danger" 
                      onClick={() => handleRemove(item.productId)}
                      className="px-3"
                    >
                      <i className="fas fa-trash-alt me-1"></i> Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="d-flex align-items-center">
            <h4 className="mb-0 me-3">Total:</h4>
            <span className="total-amount">${total.toFixed(2)}</span>
          </div>
          <Button 
            color="success" 
            onClick={handleCheckout}
            className="px-4"
          >
            <i className="fas fa-arrow-right me-1"></i> Proceed to Checkout
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Cart;
