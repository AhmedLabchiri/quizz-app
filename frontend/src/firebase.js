import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBbKlC8qh0SJeH4I4IROdkFIpwSyk7a5tE",
  authDomain: "quizzapp-ec776.firebaseapp.com",
  projectId: "quizzapp-ec776",
  storageBucket: "quizzapp-ec776.firebasestorage.app",
  messagingSenderId: "1030163137471",
  appId: "1:1030163137471:web:c9177a058151126aef570a",
  measurementId: "G-07P5QT9W92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app; 