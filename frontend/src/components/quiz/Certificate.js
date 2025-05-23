import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaDownload, FaTrophy, FaCheckCircle } from 'react-icons/fa';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './Certificate.css';

const Certificate = ({ quiz, score, userName }) => {
  const certificateRef = useRef(null);
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDownload = async () => {
    const certificate = certificateRef.current;
    const canvas = await html2canvas(certificate, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = (pdfHeight - imgHeight * ratio) / 2;
    
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`quiz-certificate-${quiz.subject.toLowerCase()}.pdf`);
  };

  return (
    <Container className="certificate-container">
      <div className="certificate-wrapper" ref={certificateRef}>
        <div className="certificate">
          <div className="certificate-header">
            <FaTrophy className="certificate-icon" />
            <h1>Certificate of Achievement</h1>
          </div>
          
          <div className="certificate-body">
            <p className="certificate-text">
              This is to certify that
            </p>
            <h2 className="certificate-name">{userName}</h2>
            <p className="certificate-text">
              has successfully completed the
            </p>
            <h3 className="certificate-quiz">{quiz.subject} Quiz</h3>
            <p className="certificate-text">
              with a score of
            </p>
            <div className="certificate-score">
              <span>{score}%</span>
            </div>
            <p className="certificate-text">
              <FaCheckCircle className="me-2" />
              Passed with Distinction
            </p>
          </div>
          
          <div className="certificate-footer">
            <div className="certificate-date">
              <p>Date: {date}</p>
            </div>
            <div className="certificate-seal">
              <div className="seal-circle">
                <span>SEAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-4">
        <Button 
          variant="primary" 
          size="lg" 
          onClick={handleDownload}
          className="download-button"
        >
          <FaDownload className="me-2" />
          Download Certificate
        </Button>
      </div>
    </Container>
  );
};

export default Certificate; 