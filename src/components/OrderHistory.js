import React, { useState, useEffect } from 'react';
import { Container, Card, CardBody, Table, Button, Alert, Spinner, Badge } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../utils/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login');
      return;
    }
    
    loadOrderHistory();
  }, [user, navigate]);

  const loadOrderHistory = async () => {
    try {
      setLoading(true);
      const orderHistory = await orderAPI.getOrderHistory();
      setOrders(orderHistory);
    } catch (err) {
      setError(err.message || 'Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrderDetails = async (orderId) => {
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(null);
      return;
    }

    try {
      setLoading(true);
      const orderDetails = await orderAPI.getOrderById(orderId);
      setSelectedOrder(orderDetails);
    } catch (err) {
      setError(err.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'pending': 'warning',
      'processing': 'info',
      'shipped': 'primary',
      'delivered': 'success',
      'cancelled': 'danger'
    };
    
    return (
      <Badge color={statusColors[status] || 'secondary'} pill>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && !orders.length) {
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
        <p className="mt-2">Loading order history...</p>
      </div>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Your Order History</h2>
        <Button color="primary" onClick={() => navigate('/home')}>
          <i className="fas fa-arrow-left me-1"></i> Back to Home
        </Button>
      </div>

      {error && <Alert color="danger" className="mb-4">{error}</Alert>}
      
      {orders.length === 0 && !loading ? (
        <Alert color="info">
          You haven't placed any orders yet. <Button color="link" onClick={() => navigate('/home')}>Start shopping now!</Button>
        </Alert>
      ) : (
        <Card className="shadow-sm">
          <CardBody>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr>
                      <td>#{String(order.id).slice(-6)}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>{order.OrderItems.length} item(s)</td>
                      <td>${parseFloat(order.totalAmount).toFixed(2)}</td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>
                        <Button 
                          color="link" 
                          size="sm" 
                          onClick={() => handleViewOrderDetails(order.id)}
                        >
                          {selectedOrder && selectedOrder.id === order.id ? 'Hide Details' : 'View Details'}
                        </Button>
                      </td>
                    </tr>
                    {selectedOrder && selectedOrder.id === order.id && (
                      <tr>
                        <td colSpan="6" className="bg-light">
                          <div className="p-3">
                            <h5 className="mb-3">Order Details</h5>
                            <Table bordered size="sm">
                              <thead>
                                <tr>
                                  <th>Product</th>
                                  <th>Price</th>
                                  <th>Quantity</th>
                                  <th>Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedOrder.OrderItems.map((item, index) => (
                                  <tr key={index}>
                                    <td>
                                      <div className="d-flex align-items-center">
                                        {item.Product?.image && (
                                          <img 
                                            src={item.Product.image} 
                                            alt={item.Product?.name || 'Product'} 
                                            className="me-2" 
                                            style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
                                          />
                                        )}
                                        <span>{item.Product?.name || 'Product'}</span>
                                      </div>
                                    </td>
                                    <td>
                                      ${parseFloat(item.pricePaid).toFixed(2)}
                                      {item.isDiscounted && (
                                        <span className="ms-2 text-muted text-decoration-line-through">
                                          ${parseFloat(item.originalPrice).toFixed(2)}
                                        </span>
                                      )}
                                    </td>
                                    <td>{item.quantity}</td>
                                    <td>${(parseFloat(item.pricePaid) * item.quantity).toFixed(2)}</td>
                                  </tr>
                                ))}
                                <tr>
                                  <td colSpan="3" className="text-end fw-bold">Total:</td>
                                  <td className="fw-bold">${parseFloat(selectedOrder.totalAmount).toFixed(2)}</td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      )}
    </Container>
  );
};

export default OrderHistory; 