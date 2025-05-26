import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, Button, Input, Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { getProducts, getCategoryById, addToCart } from '../utils/dataUtils';
import '../styles/global.css';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setProducts(getProducts());
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

  const handleAddToCart = (productId) => {
    addToCart(productId);
    alert('Added to cart!');
  };

  return (
    <div>
      <Navbar color="light" light expand="md" className="mb-4">
        <Container>
          <NavbarBrand className="d-flex align-items-center">
            <span className="navbar-brand-text">E-Commerce</span>
          </NavbarBrand>
          <NavbarToggler onClick={() => {}} />
          <Collapse navbar>
            <Nav className="ms-auto" navbar>
              <NavItem>
                <span className="welcome-text me-3">Welcome, {userType === 'admin' ? 'Admin' : 'Customer'}</span>
              </NavItem>
              <NavItem>
                <div className="d-flex align-items-center">
                  <Input 
                    type="search" 
                    placeholder="🔍 Search products..." 
                    value={searchTerm}
                    onChange={handleSearch}
                    className="me-2 search-bar"
                  />
                </div>
              </NavItem>
              {userType === 'admin' && (
                <NavItem>
                  <NavLink href="/admin" className="nav-link">
                    <i className="fas fa-cog me-1"></i> Dashboard
                  </NavLink>
                </NavItem>
              )}
              <NavItem>
                <NavLink href="/cart" className="nav-link">
                  <i className="fas fa-shopping-cart me-1"></i> Cart
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/" onClick={handleLogout} className="nav-link">
                  <i className="fas fa-sign-out-alt me-1"></i> Logout
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>

      <Container>
        <h2 className="mb-4">Featured Products</h2>
        <Row>
          {filteredProducts.map((product) => (
            <Col md={4} key={product.id} className="mb-4">
              <Card className="h-100">
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">{product.name}</h5>
                    <span className="badge bg-primary rounded-pill">{getCategoryById(product.category).name}</span>
                  </div>
                  <div className="product-price mb-2">${product.price}</div>
                  <div className="product-unit text-muted mb-3">
                    {product.quantity} {product.unit} available
                  </div>
                  <div className="product-description mb-3">
                    {product.description}
                  </div>
                  <Button 
                    color="primary" 
                    block 
                    onClick={() => handleAddToCart(product.id)}
                    className="px-4"
                  >
                    <i className="fas fa-cart-plus me-1"></i> Add to Cart
                  </Button>
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
