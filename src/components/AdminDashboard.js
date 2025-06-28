import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert, Collapse, Badge } from 'reactstrap';
import { productAPI, categoryAPI } from '../utils/productApi';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
              {product.Category?.name || 'Uncategorized'}
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
          
          <div className="d-flex justify-content-between mb-3">
            <Button 
              color="primary" 
              size="sm" 
              onClick={() => onEdit(product)}
              className="fw-bold"
              style={{ 
                borderRadius: '6px',
                padding: '0.4rem 0.8rem',
                boxShadow: '0 2px 4px rgba(67, 97, 238, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <i className="fas fa-edit me-1"></i> Edit
            </Button>
            <Button 
              color="danger" 
              size="sm" 
              onClick={() => onDelete(product.id)}
              className="fw-bold"
              style={{ 
                borderRadius: '6px',
                padding: '0.4rem 0.8rem',
                boxShadow: '0 2px 4px rgba(220, 53, 69, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <i className="fas fa-trash-alt me-1"></i> Delete
            </Button>
          </div>
          
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
              
              <div className="mb-2">
                <strong>Description:</strong>
                <p 
                  className="mb-2 mt-1"
                  style={{
                    fontSize: '0.9rem',
                    lineHeight: '1.4',
                    color: '#555'
                  }}
                >
                  {product.description}
                </p>
              </div>
              
              <div 
                className="text-muted small"
                style={{
                  backgroundColor: '#e9ecef',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}
              >
                <strong>Product ID:</strong> {product.id}
              </div>
            </div>
          </Collapse>
        </div>
      </CardBody>
    </Card>
  );
};

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    unit: '',
    quantity: '',
    description: '',
    discountedPrice: '',
    rating: '',
    image: null
  });

  useEffect(() => {
    loadProductsAndCategories();
  }, []);

  const loadProductsAndCategories = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productAPI.getAllProducts(),
        categoryAPI.getAllCategories()
      ]);
      setProducts(productsData);
      console.log(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        categoryId: product.category.id,
        price: product.price,
        unit: product.unit,
        quantity: product.quantity,
        description: product.description,
        discountedPrice: product.discountedPrice,
        rating: product.rating,
        image: null
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        categoryId: '',
        price: '',
        unit: '',
        quantity: '',
        description: '',
        discountedPrice: '',
        rating: '',
        image: null
      });
    }
    setModal(!modal);
  };

  const handleChange = (e) => {
    const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (selectedProduct) {
        await productAPI.updateProduct(selectedProduct.id, formData);
      } else {
        await productAPI.createProduct(formData);
      }
      await loadProductsAndCategories();
      toggleModal();
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        await productAPI.deleteProduct(productId);
        await loadProductsAndCategories();
      } catch (err) {
        setError(err.message || 'Failed to delete product');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && !products.length) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div>
      <nav className="navbar navbar-light bg-light mb-4">
        <div className="container">
          <div className="d-flex align-items-center">
            <Button 
              color="primary"
              className="me-3"
              onClick={() => navigate('/home')}
              style={{
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                fontWeight: 'bold'
              }}
            >
              <i className="fas fa-home me-1"></i> Back to Home
            </Button>
            <span className="navbar-brand mb-0 h1">Admin Dashboard</span>
          </div>
          <Button color="primary" onClick={() => toggleModal()}>
            <i className="fas fa-plus me-1"></i> Add New Product
          </Button>
          
        </div>
      </nav>

      <Container>
        {error && <Alert color="danger" className="mb-4">{error}</Alert>}
        <Row>
          {products.map((product) => (
            <Col md={4} key={product.id} className="mb-4">
              <ProductCard 
                product={product} 
                onEdit={toggleModal}
                onDelete={handleDelete}
              />
            </Col>
          ))}
        </Row>
      </Container>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {selectedProduct ? 'Edit Product' : 'Add New Product'}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input 
                type="text" 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="categoryId">Category</Label>
              <Input 
                type="select" 
                id="categoryId" 
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="price">Price</Label>
              <Input 
                type="number" 
                id="price" 
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="discountedPrice">Discounted Price</Label>
              <Input 
                type="number" 
                id="discountedPrice" 
                name="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="unit">Unit</Label>
              <Input 
                type="select" 
                id="unit" 
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
              >
                <option value="Kg">Kg</option>
                <option value="Liter">Liter</option>
                <option value="Piece">Piece</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="quantity">Quantity</Label>
              <Input 
                type="number" 
                id="quantity" 
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="rating">Rating</Label>
              <Input 
                type="number" 
                id="rating" 
                name="rating"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input 
                type="textarea" 
                id="description" 
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="image">Product Image</Label>
              <Input 
                type="file" 
                id="image" 
                name="image"
                onChange={handleChange}
                accept="image/*"
              />
            </FormGroup>
            <Button color="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
