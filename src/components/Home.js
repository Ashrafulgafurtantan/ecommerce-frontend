import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, Button, Input, Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { getProducts, getCategories, getCategoryById } from '../utils/dataUtils';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    loadProductsAndCategories();
  }, []);

  const loadProductsAndCategories = () => {
    setProducts(getProducts());
    setCategories(getCategories());
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  return (
    <div>
      <Navbar color="light" light expand="md" className="mb-4">
        <Container>
          <NavbarBrand>E-Commerce</NavbarBrand>
          <NavbarToggler onClick={() => {}} />
          <Collapse navbar>
            <Nav className="me-auto" navbar>
              <NavItem>
                <Input 
                  type="search" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={handleSearch}
                  className="me-2"
                />
              </NavItem>
            </Nav>
            <Nav navbar>
              <NavItem>
                <span className="me-3">Welcome, {userType === 'admin' ? 'Admin' : 'Customer'}</span>
              </NavItem>
              {userType === 'admin' && (
                <NavItem>
                  <NavLink href="/admin">Admin Dashboard</NavLink>
                </NavItem>
              )}
              <NavItem>
                <Button color="secondary" onClick={handleLogout}>Logout</Button>
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>

      <Container>
        <h2 className="mb-4">Our Products</h2>
        <Row>
          {filteredProducts.map((product) => (
            <Col md={4} key={product.id} className="mb-4">
              <Card>
                <CardBody>
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">
                    <strong>Category:</strong> {getCategoryById(product.category).name}<br />
                    <strong>Price:</strong> ${product.price}<br />
                    <strong>Unit:</strong> {product.unit}<br />
                    <strong>Available:</strong> {product.quantity} {product.unit}<br />
                    <strong>Description:</strong> {product.description}
                  </p>
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
