import React, { useState, useEffect } from 'react';
import { Container, Card, CardBody, Button, Alert, Spinner } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../utils/api';
import '../styles/global.css';

const Checkout = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handlePayment = async () => {
    if (window.confirm('Are you sure you want to confirm this order?')) {
      setIsLoading(true);
      try {
        // Format order data according to API requirements
        const orderData = {
          items: cartItems.map(item => ({
            productId: item._id,
            quantity: item.quantity
          }))
        };

        // Send order to the API
        await orderAPI.createOrder(orderData);
        
        // Show success message
        setMessage('Order confirmed successfully! Your items will be delivered soon.');
        
        // Clear the cart
        clearCart();
        
        // Redirect to home after a delay
        setTimeout(() => {
          navigate('/home');
        }, 2000);
      } catch (error) {
        setMessage(error.message || 'Failed to process your order. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + ((item.discountedPrice || item.price) * item.quantity), 0);
  };

  return (
    <div>
      <Container className="mt-4">
        <Card className="shadow">
          <CardBody>
            <div className="text-center mb-4">
              <i className="fas fa-shopping-bag fa-3x text-primary mb-3"></i>
              <h2>Checkout</h2>
              <p className="text-muted mb-4">Review your order before payment</p>
            </div>
            
            {message && (
              <Alert color={message.includes('confirmed') ? 'success' : 'danger'}>
                <i className={`fas ${message.includes('confirmed') ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2`}>
                </i>
                {message}
              </Alert>
            )}

            <div className="mb-4">
              <h4 className="mb-3">Order Summary</h4>
              <div className="list-group">
                {cartItems.map((item) => (
                  <div key={item._id} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-0">{item.name}</h5>
                        <small className="text-muted">
                          {item.quantity} {item.unit} - ${((item.discountedPrice || item.price) * item.quantity).toFixed(2)}
                        </small>
                      </div>
                      <span className="badge bg-primary rounded-pill">
                        ${item.discountedPrice || item.price} x {item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5>Total Amount</h5>
                    <span className="total-amount">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <Button 
                color="primary" 
                onClick={() => navigate('/cart')}
                className="px-4"
                disabled={isLoading}
              >
                <i className="fas fa-arrow-left me-1"></i> Back to Cart
              </Button>
              <Button 
                color="success" 
                onClick={handlePayment}
                disabled={isLoading || message.includes('confirmed') || cartItems.length === 0}
                className="px-4"
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" className="me-1" /> Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-credit-card me-1"></i> Confirm Payment
                  </>
                )}
              </Button>
            </div>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default Checkout;
