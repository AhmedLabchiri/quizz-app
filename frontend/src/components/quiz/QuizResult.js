import React from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrophy, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { auth } from '../../firebase';
import Certificate from './Certificate';
import './QuizResult.css';

const QuizResult = ({ result, quiz, answers }) => {
  const navigate = useNavigate();
  const score = Math.round((result.score / result.total) * 100);
  const passed = score >= 80;
  const userName = auth.currentUser?.displayName || 'User';

  return (
    <Container className="result-container">
      <Card className="result-card">
        <Card.Body>
          <div className="text-center mb-4">
            {passed ? (
              <FaTrophy className="result-icon success" size={50} />
            ) : (
              <FaTimesCircle className="result-icon error" size={50} />
            )}
            <h2 className="mt-3">Quiz Results</h2>
          </div>

          <div className="result-details">
            <div className="result-score">
              <span className="score-value">{score}%</span>
              <span className="score-label">Your Score</span>
            </div>

            <div className="result-stats">
              <div className="stat-item">
                <span className="stat-label">Correct Answers</span>
                <span className="stat-value">{result.score}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Questions</span>
                <span className="stat-value">{result.total}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Status</span>
                <span className={`stat-value ${passed ? 'text-success' : 'text-danger'}`}>
                  {passed ? (
                    <>
                      <FaCheckCircle className="me-2" />
                      Passed
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="me-2" />
                      Failed
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {passed && (
            <div className="mt-4">
              <Alert variant="success" className="certificate-alert">
                <FaTrophy className="me-2" />
                Congratulations! You've earned a certificate for your achievement!
              </Alert>
              <Certificate 
                quiz={quiz} 
                score={score} 
                userName={userName}
              />
            </div>
          )}

          {!passed && (
            <Alert variant="warning" className="mt-4">
              <p className="mb-0">
                You need to score at least 80% to receive a certificate. Keep practicing!
              </p>
            </Alert>
          )}

          <div className="text-center mt-4">
            <Button 
              variant="primary" 
              onClick={() => navigate('/dashboard')}
              className="result-button"
            >
              <FaArrowLeft className="me-2" />
              Back to Dashboard
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default QuizResult; 