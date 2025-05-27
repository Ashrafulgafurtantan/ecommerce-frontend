import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect to home
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      if (response && response.token) {
        // Decode token to get user info
        const base64Url = response.token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decodedToken = JSON.parse(jsonPayload);
        const userData = {
          token: response.token,
          fullName: decodedToken.fullName,
          email: decodedToken.email,
          userType: decodedToken.userType
        };
        
        await login(userData, response.token);
        navigate('/home');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  // If user is already logged in, don't render the login form
  if (user) {
    return null;
  }

  return (
    <Container className="mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Card>
            <CardBody>
              <CardTitle tag="h2" className="text-center mb-4">Login</CardTitle>
              {error && <Alert color="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
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
                <Button color="primary" block type="submit" disabled={loading}>
                  {loading ? 'Signing in...' : 'Login'}
                </Button>
              </Form>
              <div className="text-center mt-3">
                <p>Don't have an account? <a href="/register">Sign up</a></p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Login;
