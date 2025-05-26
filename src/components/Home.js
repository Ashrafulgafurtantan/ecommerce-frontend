import React from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: 'Product 1',
    price: '$99.99',
    description: 'Description for product 1'
  },
  {
    id: 2,
    name: 'Product 2',
    price: '$149.99',
    description: 'Description for product 2'
  },
  {
    id: 3,
    name: 'Product 3',
    price: '$199.99',
    description: 'Description for product 3'
  }
];

const Home = () => {
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar navbar-light bg-light mb-4">
        <div className="container">
          <span className="navbar-brand mb-0 h1">E-Commerce</span>
          <div className="d-flex">
            <span className="me-3">Welcome, {userType === 'admin' ? 'Admin' : 'Customer'}</span>
            <Button color="secondary" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </nav>

      <Container>
        <h2 className="mb-4">Our Products</h2>
        <Row>
          {products.map((product) => (
            <Col md={4} key={product.id} className="mb-4">
              <Card>
                <CardBody>
                  <CardTitle tag="h5">{product.name}</CardTitle>
                  <p className="card-text">{product.description}</p>
                  <h5 className="card-title">{product.price}</h5>
                  <Button color="primary" block>Add to Cart</Button>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
