import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post('/token-auth/', {
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = (email, password) => {
  return axiosInstance.post('/register/', { email, password });
};

// Quiz API
export const generateQuiz = (subject, difficulty) => {
  return axiosInstance.post('/generate/', { subject, difficulty });
};

export const fetchQuizzes = () => {
  return axiosInstance.get('/quizzes/');
};

export const fetchQuiz = (quizId) => {
  return axiosInstance.get(`/quizzes/${quizId}/`);
};

export const submitQuiz = (quizId, answers) => {
  return axiosInstance.post(`/submit/${quizId}/`, { answers });
};

export const fetchHistory = () => {
  return axiosInstance.get('/history/');
};

export const fetchCertificates = () => {
  return axiosInstance.get('/certificates/');
};

export const downloadCertificate = (historyId) => {
  return axiosInstance.get(`/certificates/download/${historyId}/`, {
    responseType: 'blob'
  });
}; 