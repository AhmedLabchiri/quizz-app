import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuiz, submitQuiz } from '../../services/api';
import QuizResult from './QuizResult';
import { 
  FaArrowLeft, 
  FaCheck, 
  FaQuestionCircle, 
  FaBook,
  FaSpinner
} from 'react-icons/fa';
import './Quiz.css';

const Quiz = () => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const response = await fetchQuiz(quizId);
        setQuiz(response.data);
        
        // Initialize answers array with empty strings
        setAnswers(new Array(response.data.questions.length).fill(''));
        
        setLoading(false);
      } catch (error) {
        setError('Failed to load quiz: ' + error.message);
        setLoading(false);
      }
    };
    
    loadQuiz();
  }, [quizId]);
  
  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if all questions are answered
    if (answers.some(answer => !answer.trim())) {
      setError('Please answer all questions before submitting.');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      const response = await submitQuiz(quizId, answers);
      setResult(response.data);
      
    } catch (error) {
      setError('Failed to submit quiz: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const calculateProgress = () => {
    if (!quiz) return 0;
    const answered = answers.filter(answer => answer.trim()).length;
    return (answered / quiz.questions.length) * 100;
  };
  
  if (loading) {
    return (
      <Container className="quiz-loading">
        <FaSpinner className="loading-spinner text-primary" />
        <p className="mt-3">Loading quiz...</p>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <FaQuestionCircle className="me-2" />
          {error}
        </Alert>
        <Button 
          variant="primary" 
          onClick={() => navigate('/dashboard')}
          className="quiz-button"
        >
          <FaArrowLeft className="me-2" />
          Back to Dashboard
        </Button>
      </Container>
    );
  }
  
  if (result) {
    return <QuizResult result={result} quiz={quiz} answers={answers} />;
  }
  
  return (
    <Container className="quiz-container">
      <Card className="quiz-form">
        <div className="quiz-header">
          <h2 className="quiz-title">
            <FaBook className="me-2" />
            {quiz.subject}
          </h2>
          <p className="quiz-subtitle">
            <span className={`difficulty-badge ${quiz.difficulty.toLowerCase()}`}>
              {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
            </span>
          </p>
        </div>
        
        <Card.Body>
          <div className="quiz-progress">
            <div className="d-flex justify-content-between mb-2">
              <span>Progress</span>
              <span>{Math.round(calculateProgress())}%</span>
            </div>
            <ProgressBar 
              now={calculateProgress()} 
              className="progress-bar"
            />
          </div>
          
          <Form onSubmit={handleSubmit}>
            {quiz.questions.map((question, index) => (
              <div 
                key={index} 
                className="question-container"
                style={{ '--question-index': index }}
              >
                <Form.Group className="mb-3">
                  <Form.Label className="question-text">
                    <span className="question-number">Q{index + 1}:</span>
                    {question.text}
                  </Form.Label>
                  <Form.Control
                    as="textarea" 
                    rows={3}
                    placeholder="Type your answer here..."
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    disabled={submitting}
                    required
                    className="answer-textarea"
                  />
                </Form.Group>
              </div>
            ))}
            
            <div className="quiz-actions">
              <div className="d-flex justify-content-between">
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/dashboard')}
                  disabled={submitting}
                  className="quiz-button"
                >
                  <FaArrowLeft className="me-2" />
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={submitting}
                  className="quiz-button submit-button"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="me-2" spin />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaCheck className="me-2" />
                      Submit Answers
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Quiz; 