import React, { useState } from 'react';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { registerUser } from '../../services/api';
import { FaEnvelope, FaLock, FaUserPlus, FaCheck } from 'react-icons/fa';
import './Auth.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Register with Firebase
      await createUserWithEmailAndPassword(auth, email, password);
      
      // Register with Django backend
      await registerUser(email, password);
      
      navigate('/login');
    } catch (error) {
      setError('Failed to create an account: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="auth-container">
        <Card.Body>
          <div className="text-center mb-4">
            <FaUserPlus className="auth-icon" size={50} />
            <h2 className="mt-3">Create Account</h2>
            <p className="text-muted">Join us and start your learning journey</p>
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
                placeholder="Create a password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control-lg"
              />
              <Form.Text className="text-muted">
                Password must be at least 6 characters long
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formConfirmPassword">
              <Form.Label>
                <FaLock className="me-2" />
                Confirm Password
              </Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Confirm your password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Creating Account...
                </>
              ) : (
                <>
                  <FaUserPlus className="me-2" />
                  Create Account
                </>
              )}
            </Button>
          </Form>
          
          <div className="text-center mt-4">
            <p className="mb-0">
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register; 