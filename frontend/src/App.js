import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Quiz from './components/quiz/Quiz';
import History from './components/history/History';
import CertificatesHistory from './components/certificates/CertificatesHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        
        <Route 
          path="/quiz/:quizId" 
          element={
            <PrivateRoute>
              <Quiz />
            </PrivateRoute>
          }
        />
        
        <Route 
          path="/history" 
          element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          }
        />

        <Route 
          path="/certificates" 
          element={
            <PrivateRoute>
              <CertificatesHistory />
            </PrivateRoute>
          }
        />
        
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App; 