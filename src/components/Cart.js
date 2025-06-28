import React from 'react';
import { Container, Row, Col, Card, CardBody, Button, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { user } = useAuth();

  const handleQuantityChange = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <Container className="mt-5">
        <Card 
          className="border-0 shadow text-center py-5"
          style={{
            borderRadius: '15px',
            background: 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)'
          }}
        >
          <CardBody className="py-5">
            <div 
              className="empty-cart-icon mb-4"
              style={{
                width: '120px',
                height: '120px',
                margin: '0 auto',
                background: 'linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 20px rgba(67, 97, 238, 0.3)',
                animation: 'pulse 2s infinite'
              }}
            >
              <i className="fas fa-shopping-cart fa-3x" style={{ color: 'white' }}></i>
            </div>
            <h2 
              className="mb-3"
              style={{
                fontWeight: '700',
                color: '#212529',
                letterSpacing: '0.5px'
              }}
            >
              Your Cart is Empty
            </h2>
            <p 
              className="text-muted mb-4"
              style={{
                fontSize: '1.1rem',
                maxWidth: '500px',
                margin: '0 auto'
              }}
            >
              Looks like you haven't added anything to your cart yet. 
              Explore our products and find something you'll love!
            </p>
            <Button 
              color="primary" 
              size="lg" 
              onClick={() => navigate('/home')}
              className="px-5 py-3 fw-bold"
              style={{
                borderRadius: '50px',
                boxShadow: '0 5px 15px rgba(67, 97, 238, 0.3)',
                transition: 'all 0.3s',
                background: 'linear-gradient(to right, #4361ee, #3f37c9)',
                border: 'none',
                letterSpacing: '0.5px',
                transform: 'translateY(0)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(67, 97, 238, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(67, 97, 238, 0.3)';
              }}
            >
              <i className="fas fa-store me-2"></i> Continue Shopping
            </Button>
            <style>
              {`
                @keyframes pulse {
                  0% {
                    transform: scale(1);
                  }
                  50% {
                    transform: scale(1.05);
                  }
                  100% {
                    transform: scale(1);
                  }
                }
              `}
            </style>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Shopping Cart</h2>
      <Row>
        <Col md={8}>
          {cartItems.map((item) => (
            <Card key={item.id} className="mb-3">
              <CardBody>
                <Row>
                  <Col md={3}>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid"
                        style={{ maxHeight: '150px', objectFit: 'cover' }}
                      />
                    )}
                  </Col>
                  <Col md={9}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="mb-2">{item.name}</h5>
                        <p className="text-muted mb-2">{item.Category?.name || 'Uncategorized'}</p>
                        <div className="d-flex align-items-center mb-2">
                          <div className="product-discounted-price text-primary fw-bold me-2">
                            ${item.discountedPrice || item.price}
                          </div>
                          {item.discountedPrice && (
                            <div className="product-price text-muted text-decoration-line-through">
                              ${item.price}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="d-flex align-items-center"
                      >
                        <i className="fas fa-trash-alt me-1"></i>
                        Remove
                      </Button>
                    </div>
                    <div className="d-flex align-items-center mt-3">
                      <div className="d-flex align-items-center me-3">
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                          className="px-2"
                        >
                          <i className="fas fa-minus" style={{ color: 'white' }}></i>
                        </Button>
                        <span className="mx-3" style={{ minWidth: '30px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <Button
                          color="success"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                          className="px-2"
                        >
                          <i className="fas fa-plus" style={{ color: 'white' }}></i>
                        </Button>
                      </div>
                      <div className="ms-3">
                        Subtotal: ${((item.discountedPrice || item.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          ))}
        </Col>
        <Col md={4}>
          <Card>
            <CardBody>
              <h4 className="mb-4">Order Summary</h4>
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <strong>Total:</strong>
                <strong>${getCartTotal().toFixed(2)}</strong>
              </div>
              <Button
                color="primary"
                block
                onClick={handleCheckout}
                disabled={!user}
              >
                {user ? 'Proceed to Checkout' : 'Login to Checkout'}
              </Button>
              {!user && (
                <div className="text-center mt-3">
                  <small className="text-muted">
                    Please <a href="/login">login</a> to proceed with checkout
                  </small>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
