import React, { useState, useEffect } from 'react';
import { Container, Card, CardBody, Button, Alert } from 'reactstrap';
import { getCart, processOrder } from '../utils/dataUtils';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const handlePayment = () => {
    if (window.confirm('Are you sure you want to confirm this order?')) {
      const success = processOrder(cartItems);
      if (success) {
        setMessage('Order confirmed successfully! Your items will be deducted from the stock.');
        setTimeout(() => {
          navigate('/home');
        }, 2000);
      } else {
        setMessage('Order failed. Some items are not available in sufficient quantity.');
      }
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
                  <div key={item.productId} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-0">{item.name}</h5>
                        <small className="text-muted">
                          {item.quantity} {item.unit} - ${(item.price * item.quantity).toFixed(2)}
                        </small>
                      </div>
                      <span className="badge bg-primary rounded-pill">
                        ${item.price} x {item.quantity}
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
              >
                <i className="fas fa-arrow-left me-1"></i> Back to Cart
              </Button>
              <Button 
                color="success" 
                onClick={handlePayment}
                disabled={message.includes('confirmed')}
                className="px-4"
              >
                <i className="fas fa-credit-card me-1"></i> Confirm Payment
              </Button>
            </div>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default Checkout;
