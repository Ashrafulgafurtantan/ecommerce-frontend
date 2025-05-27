import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { productAPI, categoryAPI } from '../utils/productApi';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
        categoryId: product.category._id,
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
        await productAPI.updateProduct(selectedProduct._id, formData);
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
          <span className="navbar-brand mb-0 h1">Admin Dashboard</span>
          <Button color="primary" onClick={() => toggleModal()}>
            Add New Product
          </Button>
        </div>
      </nav>

      <Container>
        {error && <Alert color="danger" className="mb-4">{error}</Alert>}
        <Row>
          {products.map((product) => (
            <Col md={4} key={product._id} className="mb-4">
              <Card>
                <CardBody>
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="img-fluid mb-3" 
                      style={{ maxHeight: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">
                    <strong>Category:</strong> {product.category.name}<br />
                    <strong>Price:</strong> ${product.price}<br />
                    <strong>Discounted Price:</strong> ${product.discountedPrice}<br />
                    <strong>Unit:</strong> {product.unit}<br />
                    <strong>Quantity:</strong> {product.quantity}<br />
                    <strong>Rating:</strong> {product.rating}<br />
                    <strong>Description:</strong> {product.description}
                  </p>
                  <div className="d-flex justify-content-between">
                    <Button color="primary" onClick={() => toggleModal(product)}>Edit</Button>
                    <Button color="danger" onClick={() => handleDelete(product._id)}>Delete</Button>
                  </div>
                </CardBody>
              </Card>
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
                  <option key={category._id} value={category._id}>{category.name}</option>
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
                <option value="10 count">10 count</option>
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
