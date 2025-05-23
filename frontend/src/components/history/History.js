import React, { useState, useEffect } from 'react';
import { Container, Card, ListGroup, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchHistory } from '../../services/api';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetchHistory();
        setHistory(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch history: ' + error.message);
        setLoading(false);
      }
    };
    
    loadHistory();
  }, []);
  
  const getScoreBadgeVariant = (score, total = 10) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'danger';
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <Container className="mt-4 mb-5">
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Quiz History</h2>
            <Button 
              variant="primary" 
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center my-5">
              <p>You haven't taken any quizzes yet.</p>
              <Button 
                variant="outline-primary" 
                onClick={() => navigate('/dashboard')}
              >
                Take a Quiz
              </Button>
            </div>
          ) : (
            <ListGroup>
              {history.map((item) => (
                <ListGroup.Item 
                  key={item.id} 
                  className="history-item"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5>{item.quiz.subject}</h5>
                      <div className="text-muted mb-2">
                        <small>
                          {formatDate(item.completed_at)}
                          <span className="ms-2 me-2">•</span>
                          Difficulty: {item.quiz.difficulty}
                        </small>
                      </div>
                    </div>
                    <Badge bg={getScoreBadgeVariant(item.score)} className="fs-6 px-3 py-2">
                      Score: {item.score}/10
                    </Badge>
                  </div>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={() => navigate(`/quiz/${item.quiz.id}`)}
                  >
                    Take Again
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default History; 