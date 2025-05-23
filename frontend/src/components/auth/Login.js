import React, { useState } from 'react';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { loginUser } from '../../services/api';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Get Django token
      const response = await loginUser(email, password);
      localStorage.setItem('token', response.token);
      
      // Sign in with Firebase
      await signInWithEmailAndPassword(auth, email, password);
      
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to sign in: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="auth-container">
        <Card.Body>
          <div className="text-center mb-4">
            <FaSignInAlt className="auth-icon" size={50} />
            <h2 className="mt-3">Welcome Back!</h2>
            <p className="text-muted">Please sign in to continue</p>
          </div>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="formBasicEmail">
              <Form.Label>
                <FaEnvelope className="me-2" />
                Email
              </Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control-lg"
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formBasicPassword">
              <Form.Label>
                <FaLock className="me-2" />
                Password
              </Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control-lg"
              />
            </Form.Group>
            
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 mt-4 auth-button" 
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <FaSignInAlt className="me-2" />
                  Sign In
                </>
              )}
            </Button>
          </Form>
          
          <div className="text-center mt-4">
            <p className="mb-0">
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Create an account
              </Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login; 