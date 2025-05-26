import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap';
import { getCategories, getProducts, updateProduct, addProduct, removeProduct, getCategoryById } from '../utils/dataUtils';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    unit: '',
    quantity: '',
    description: ''
  });

  useEffect(() => {
    loadProductsAndCategories();
  }, []);

  const loadProductsAndCategories = () => {
    setProducts(getProducts());
    setCategories(getCategories());
  };

  const toggleModal = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        unit: product.unit,
        quantity: product.quantity,
        description: product.description
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        category: '',
        price: '',
        unit: '',
        quantity: '',
        description: ''
      });
    }
    setModal(!modal);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedProduct) {
      updateProduct(selectedProduct.id, formData);
    } else {
      addProduct(formData);
    }
    loadProductsAndCategories();
    toggleModal();
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      removeProduct(productId);
      loadProductsAndCategories();
    }
  };

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
        <Row>
          {products.map((product) => (
            <Col md={4} key={product.id} className="mb-4">
              <Card>
                <CardBody>
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">
                    <strong>Category:</strong> {getCategoryById(product.category).name}<br />
                    <strong>Price:</strong> ${product.price}<br />
                    <strong>Unit:</strong> {product.unit}<br />
                    <strong>Quantity:</strong> {product.quantity}<br />
                    <strong>Description:</strong> {product.description}
                  </p>
                  <div className="d-flex justify-content-between">
                    <Button color="primary" onClick={() => toggleModal(product)}>Edit</Button>
                    <Button color="danger" onClick={() => handleDelete(product.id)}>Delete</Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Edit Product</ModalHeader>
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
              <Label for="category">Category</Label>
              <Input 
                type="select" 
                id="category" 
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
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
            <Button color="primary" type="submit">Save</Button>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
