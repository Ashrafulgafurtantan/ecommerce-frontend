import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, Button, Input, Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink, Alert, Spinner } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productAPI } from '../utils/productApi';
import '../styles/global.css';

const ProductCard = ({ product, onAddToCart }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <Card className="h-100">
      <CardBody>
        {product.image && (
          <img 
            src={product.image} 
            alt={product.name} 
            className="img-fluid mb-3" 
            style={{ maxHeight: '200px', objectFit: 'cover' }}
          />
        )}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">{product.name}</h5>
          <span className="badge bg-primary rounded-pill">{product.category.name}</span>
        </div>
        <div className="d-flex align-items-center mb-3">
          <div className="product-discounted-price text-primary fw-bold me-2">
            ${product.discountedPrice || product.price}
          </div>
          {product.discountedPrice && (
            <div className="product-price text-muted text-decoration-line-through">
              ${product.price}
            </div>
          )}
        </div>
        <Button 
          color="primary" 
          block 
          onClick={() => onAddToCart(product._id)}
          className="px-4 mb-3"
          disabled={product.quantity === 0}
        >
          <i className="fas fa-cart-plus me-1"></i> 
          {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
        <Button 
          color="link" 
          className="w-100 text-decoration-none p-0"
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
        >
          {isDetailsOpen ? 'Hide Details' : 'Show Details'}
          <i className={`fas fa-chevron-${isDetailsOpen ? 'up' : 'down'} ms-2`}></i>
        </Button>
        <Collapse isOpen={isDetailsOpen}>
          <div className="mt-3 pt-3 border-top">
            {product.rating && (
              <div className="product-rating mb-2">
                <i className="fas fa-star text-warning"></i> {product.rating} Rating
              </div>
            )}
            <div className="product-unit text-muted mb-2">
              <i className="fas fa-box me-1"></i> {product.quantity} {product.unit} available
            </div>
            <div className="product-description">
              <small className="text-muted">Description:</small>
              <p className="mb-0">{product.description}</p>
            </div>
          </div>
        </Collapse>
      </CardBody>
    </Card>
  );
};

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await productAPI.getAllProducts();
      setProducts(productsData);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddToCart = (productId) => {
    // TODO: Implement cart functionality with backend
    alert('Added to cart!');
  };

  if (loading && !products.length) {
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
        <p className="mt-2">Loading products...</p>
      </div>
    );
  }

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
                <span className="welcome-text me-3">
                  Welcome, {user?.fullName || 'Guest'}
                </span>
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
              {user?.userType === 'admin' && (
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
        {error && <Alert color="danger" className="mb-4">{error}</Alert>}
        <h2 className="mb-4">Featured Products</h2>
        <Row>
          {filteredProducts.map((product) => (
            <Col md={4} key={product._id} className="mb-4">
              <ProductCard 
                product={product} 
                onAddToCart={handleAddToCart}
              />
            </Col>
          ))}
        </Row>
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center mt-5">
            <p>No products found matching your search.</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Home;
