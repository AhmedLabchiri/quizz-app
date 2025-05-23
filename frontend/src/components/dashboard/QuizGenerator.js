import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { generateQuiz } from '../../services/api';

const QuizGenerator = ({ onQuizCreated, onCancel }) => {
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!subject) {
      setError('Please enter a subject');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await generateQuiz(subject, difficulty);
      onQuizCreated(response.data);
      
    } catch (error) {
      setError('Failed to generate quiz: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="quiz-form">
      <Card.Body>
        <Card.Title className="mb-4">Generate a New Quiz</Card.Title>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter quiz subject (e.g., 'Solar System', 'World War II')"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={loading}
              required
            />
            <Form.Text className="text-muted">
              Be specific to get better questions. For example, "Ancient Rome" instead of just "History".
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-4">
            <Form.Label>Difficulty</Form.Label>
            <Form.Select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              disabled={loading}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Form.Select>
          </Form.Group>
          
          <div className="d-flex justify-content-end">
            <Button 
              variant="secondary" 
              onClick={onCancel} 
              className="me-2" 
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Quiz'}
            </Button>
          </div>
        </Form>
        
        {loading && (
          <div className="text-center mt-4">
            <p>Generating your quiz... This may take a few moments.</p>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default QuizGenerator; 