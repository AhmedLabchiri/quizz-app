import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaAward, FaDownload, FaCalendarAlt, FaBook } from 'react-icons/fa';
import { auth } from '../../firebase';
import { fetchCertificates, downloadCertificate } from '../../services/api';
import './CertificatesHistory.css';

const CertificatesHistory = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const response = await fetchCertificates();
        setCertificates(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load certificates: ' + error.message);
        setLoading(false);
      }
    };

    loadCertificates();
  }, []);

  const handleDownload = async (historyId) => {
    try {
      setDownloading(true);
      setError('');
      
      const response = await downloadCertificate(historyId);
      
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'application/json' });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from the response headers
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'certificate.json';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      
      // Append link to body, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      setError('Failed to download certificate: ' + (error.response?.data?.error || error.message));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Container className="certificates-history-container">
      <div className="certificates-header">
        <Row className="align-items-center">
          <Col>
            <h2 className="mb-2">
              <FaAward className="me-2" />
              Your Certificates
            </h2>
            <p className="certificates-subtitle mb-0">
              View and download your earned certificates
            </p>
          </Col>
          <Col className="text-end">
            <Button 
              variant="light" 
              className="back-button"
              onClick={() => navigate('/dashboard')}
            >
              <FaArrowLeft className="me-2" />
              Back to Dashboard
            </Button>
          </Col>
        </Row>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading certificates...</p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-5">
          <FaAward className="mb-3" size={50} style={{ opacity: 0.5 }} />
          <p>No certificates earned yet. Complete quizzes with a score of 80% or higher to earn certificates!</p>
          <Button 
            variant="primary" 
            onClick={() => navigate('/dashboard')}
            className="mt-3"
          >
            <FaBook className="me-2" />
            Take a Quiz
          </Button>
        </div>
      ) : (
        <Row>
          {certificates.map((certificate) => (
            <Col key={certificate.id} md={6} lg={4} className="mb-4">
              <Card className="certificate-card h-100">
                <Card.Body>
                  <div className="certificate-icon">
                    <FaAward size={40} />
                  </div>
                  <Card.Title className="text-center mt-3">
                    {certificate.quiz_subject}
                  </Card.Title>
                  <div className="certificate-details">
                    <div className="detail-item">
                      <span className="detail-label">Score</span>
                      <span className="detail-value">{certificate.score}%</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">
                        <FaCalendarAlt className="me-2" />
                        Earned On
                      </span>
                      <span className="detail-value">
                        {new Date(certificate.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Card.Body>
                <Card.Footer className="text-center">
                  <Button 
                    variant="primary" 
                    onClick={() => handleDownload(certificate.history_id)}
                    className="w-100"
                    disabled={downloading}
                  >
                    {downloading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <FaDownload className="me-2" />
                        Download Certificate
                      </>
                    )}
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

export default CertificatesHistory; 