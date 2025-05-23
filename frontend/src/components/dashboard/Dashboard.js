import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { fetchQuizzes } from '../../services/api';
import QuizGenerator from './QuizGenerator';
import { 
  FaSignOutAlt, 
  FaHistory, 
  FaPlus, 
  FaBook, 
  FaChartLine,
  FaUserCircle,
  FaAward
} from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const response = await fetchQuizzes();
        setQuizzes(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch quizzes: ' + error.message);
        setLoading(false);
      }
    };
    
    loadQuizzes();
  }, []);
  
  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      setError('Failed to log out: ' + error.message);
    }
  };
  
  const handleQuizCreated = (newQuiz) => {
    setQuizzes([newQuiz, ...quizzes]);
    setShowGenerator(false);
  };

  const getDifficultyClass = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'difficulty-easy';
      case 'medium':
        return 'difficulty-medium';
      case 'hard':
        return 'difficulty-hard';
      default:
        return '';
    }
  };

  return (
    <Container className="dashboard-container">
      <div className="dashboard-header">
        <Row className="align-items-center">
          <Col>
            <h2 className="mb-2">
              <FaBook className="me-2" />
              Quiz Dashboard
            </h2>
            <p className="dashboard-welcome mb-0">
              <FaUserCircle className="me-2" />
              Welcome, {auth.currentUser?.displayName || 'User'}!
            </p>
          </Col>
          <Col className="text-end">
            <Button 
              variant="light" 
              className="dashboard-button me-2"
              onClick={() => navigate('/certificates')}
            >
              <FaAward className="me-2" />
              Certificates
            </Button>
            <Button 
              variant="light" 
              className="dashboard-button me-2"
              onClick={() => navigate('/history')}
            >
              <FaHistory className="me-2" />
              View History
            </Button>
            <Button 
              variant="light" 
              className="dashboard-button"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </Button>
          </Col>
        </Row>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {showGenerator ? (
        <QuizGenerator 
          onQuizCreated={handleQuizCreated} 
          onCancel={() => setShowGenerator(false)} 
        />
      ) : (
        <div className="text-center mb-4">
          <Button 
            variant="primary" 
            size="lg"
            className="create-quiz-button"
            onClick={() => setShowGenerator(true)}
          >
            <FaPlus className="me-2" />
            Create New Quiz
          </Button>
        </div>
      )}
      
      <h4 className="mt-4 mb-3">
        <FaChartLine className="me-2" />
        Recent Quizzes
      </h4>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading quizzes...</p>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-5">
          <FaBook className="mb-3" size={50} style={{ opacity: 0.5 }} />
          <p>No quizzes available. Create your first quiz!</p>
        </div>
      ) : (
        <Row>
          {quizzes.map((quiz, index) => (
            <Col key={quiz.id} md={4} className="mb-4">
              <Card 
                className="quiz-card h-100"
                style={{ '--card-index': index }}
              >
                <Card.Body>
                  <Card.Title>
                    <FaBook className="me-2" />
                    {quiz.subject}
                  </Card.Title>
                  <Card.Subtitle className="mb-2">
                    <span className={`difficulty-badge ${getDifficultyClass(quiz.difficulty)}`}>
                      {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                    </span>
                  </Card.Subtitle>
                  <Card.Text className="text-muted">
                    Created on: {new Date(quiz.created_at).toLocaleDateString()}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate(`/quiz/${quiz.id}`)}
                    className="w-100"
                  >
                    Take Quiz
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Dashboard; 