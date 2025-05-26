import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const validAdmin = email === 'admin@gmail.com' && password === 'admin';
    const validCustomer = email === 'tamanna@gmail.com' && password === '123';

    if (validAdmin || validCustomer) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', validAdmin ? 'admin' : 'customer');
      navigate('/home');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input 
                    type="password" 
                    id="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </FormGroup>
                <Button color="primary" block type="submit">Login</Button>
              </Form>
              <div className="text-center mt-3">
                <p>Don't have an account? <a href="/signup">Sign up</a></p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Login;
