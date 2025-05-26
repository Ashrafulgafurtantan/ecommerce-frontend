import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // For now, just redirect to login page
    navigate('/login');
  };

  return (
    <Container className="mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Card>
            <CardBody>
              <CardTitle tag="h2" className="text-center mb-4">Sign Up</CardTitle>
              {error && <Alert color="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="name">Full Name</Label>
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
                  <Label for="email">Email address</Label>
                  <Input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input 
                    type="password" 
                    id="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="confirmPassword">Confirm Password</Label>
                  <Input 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                <Button color="primary" block type="submit">Sign Up</Button>
              </Form>
              <div className="text-center mt-3">
                <p>Already have an account? <a href="/login">Login</a></p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Signup;
