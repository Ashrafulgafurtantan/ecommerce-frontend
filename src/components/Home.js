import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, Button, Input, Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink, Alert, Spinner, Badge } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productAPI } from '../utils/productApi';
import '../styles/global.css';

const ProductCard = ({ product, onAddToCart }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <Card 
      className={`h-100 ${isHovered ? 'shadow-lg' : 'shadow'}`}
      style={{
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-5px)' : 'none',
        borderRadius: '12px',
        border: 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardBody className="p-0">
        {product.image && (
          <div className="position-relative">
            <img 
              src={product.image} 
              alt={product.name} 
              className="img-fluid" 
              style={{ 
                height: '180px', 
                width: '100%', 
                objectFit: 'cover',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px'
              }}
            />
            <Badge 
              color="primary" 
              pill
              className="position-absolute"
              style={{ 
                top: '10px', 
                right: '10px',
                fontSize: '0.8rem',
                padding: '0.5em 0.8em',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}
            >
              {product.category.name}
            </Badge>
          </div>
        )}
        <div className="p-3">
          <h5 
            className="card-title mb-2 fw-bold"
            style={{ 
              fontSize: '1.2rem', 
              letterSpacing: '0.02em'
            }}
          >
            {product.name}
          </h5>
          
          <div className="d-flex align-items-center mb-3">
            <div 
              className="me-2 fw-bold"
              style={{ 
                fontSize: '1.3rem', 
                color: '#4361ee',
                letterSpacing: '0.03em'
              }}
            >
              ${product.discountedPrice || product.price}
            </div>
            {product.discountedPrice && (
              <div 
                className="text-muted text-decoration-line-through"
                style={{ 
                  fontSize: '0.9rem' 
                }}
              >
                ${product.price}
              </div>
            )}
          </div>
          
          <div className="mb-3">
            <span 
              className={`badge ${product.quantity > 0 ? 'bg-success' : 'bg-danger'}`}
              style={{ 
                padding: '0.4em 0.7em',
                fontSize: '0.8rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
            <span 
              className="ms-2"
              style={{ 
                fontSize: '0.9rem',
                color: '#666'
              }}
            >
              {product.quantity} {product.unit} available
            </span>
          </div>
          
          <Button 
            color="primary" 
            block 
            onClick={handleAddToCart}
            className="fw-bold"
            disabled={product.quantity === 0}
            style={{ 
              borderRadius: '8px',
              padding: '0.6rem 1rem',
              boxShadow: '0 2px 4px rgba(67, 97, 238, 0.3)',
              transition: 'all 0.2s ease',
              marginBottom: '1rem'
            }}
          >
            <i className="fas fa-cart-plus me-2"></i> 
            {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
          
          <Button 
            color="link" 
            className="w-100 text-decoration-none p-0 fw-bold"
            style={{
              color: '#4361ee',
              letterSpacing: '0.02em',
              fontSize: '0.95rem'
            }}
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          >
            {isDetailsOpen ? 'Hide Details' : 'Show Details'}
            <i className={`fas fa-chevron-${isDetailsOpen ? 'up' : 'down'} ms-2`}></i>
          </Button>
          
          <Collapse isOpen={isDetailsOpen}>
            <div 
              className="mt-3 pt-3 border-top"
              style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '15px'
              }}
            >
              {product.rating && (
                <div className="mb-2 d-flex align-items-center">
                  <div 
                    className="me-2"
                    style={{
                      backgroundColor: '#fff3cd',
                      color: '#856404',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <i className="fas fa-star"></i>
                  </div>
                  <div>
                    <strong>Rating:</strong> 
                    <span className="ms-1 fw-bold">{product.rating}</span>
                  </div>
                </div>
              )}
              
              <div 
                className="product-unit text-muted mb-2"
                style={{
                  fontSize: '0.9rem',
                  lineHeight: '1.4'
                }}
              >
                <i className="fas fa-box me-1"></i> {product.quantity} {product.unit} available
              </div>
              
              <div className="product-description">
                <strong>Description:</strong>
                <p 
                  className="mb-0 mt-1"
                  style={{
                    fontSize: '0.9rem',
                    lineHeight: '1.4',
                    color: '#555'
                  }}
                >
                  {product.description}
                </p>
              </div>
            </div>
          </Collapse>
        </div>
      </CardBody>
    </Card>
  );
};

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addToCartMessage, setAddToCartMessage] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addToCart } = useCart();

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
    navigate('/login', { replace: true });
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddToCartMessage(`${product.name} added to cart!`);
    setTimeout(() => setAddToCartMessage(''), 2000); // Clear message after 2 seconds
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
                <NavLink href="/order-history" className="nav-link">
                  <i className="fas fa-history me-1"></i> Order History
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
        {addToCartMessage && (
          <Alert color="success" className="mb-4">
            {addToCartMessage}
          </Alert>
        )}
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
