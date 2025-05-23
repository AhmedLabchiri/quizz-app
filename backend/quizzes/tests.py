from django.test import TestCase
from django.conf import settings
from unittest.mock import patch, MagicMock
import json
from .quiz_service import test_openai_connection, generate_quiz_questions, grade_quiz

class QuizServiceTests(TestCase):
    def setUp(self):
        """Set up test data and mocks"""
        self.sample_questions = {
            "questions": [
                {
                    "text": "What is the capital of France?",
                    "answer": "Paris"
                },
                {
                    "text": "What is 2 + 2?",
                    "answer": "4"
                }
            ]
        }
        
        self.mock_openai_response = MagicMock()
        self.mock_openai_response.choices = [
            MagicMock(
                message=MagicMock(
                    content=json.dumps(self.sample_questions)
                )
            )
        ]

    @patch('openai.OpenAI')
    def test_openai_connection_success(self, mock_openai):
        """Test successful OpenAI API connection"""
        # Mock the OpenAI client
        mock_client = MagicMock()
        mock_openai.return_value = mock_client
        mock_client.chat.completions.create.return_value = self.mock_openai_response

        # Test the connection
        success, message = test_openai_connection()
        
        self.assertTrue(success)
        self.assertEqual(message, "OpenAI API connection successful!")
        mock_client.chat.completions.create.assert_called_once()

    @patch('openai.OpenAI')
    def test_openai_connection_failure(self, mock_openai):
        """Test failed OpenAI API connection"""
        # Mock the OpenAI client to raise an exception
        mock_client = MagicMock()
        mock_openai.return_value = mock_client
        mock_client.chat.completions.create.side_effect = Exception("API Error")

        # Test the connection
        success, message = test_openai_connection()
        
        self.assertFalse(success)
        self.assertTrue("OpenAI API connection failed" in message)

    @patch('openai.OpenAI')
    def test_generate_quiz_questions_success(self, mock_openai):
        """Test successful quiz question generation"""
        # Mock the OpenAI client
        mock_client = MagicMock()
        mock_openai.return_value = mock_client
        mock_client.chat.completions.create.return_value = self.mock_openai_response

        # Generate questions
        questions = generate_quiz_questions("Geography", "easy", 2)
        
        self.assertEqual(len(questions), 2)
        self.assertEqual(questions[0]["text"], "What is the capital of France?")
        self.assertEqual(questions[0]["answer"], "Paris")
        mock_client.chat.completions.create.assert_called_once()

    @patch('openai.OpenAI')
    def test_generate_quiz_questions_api_error(self, mock_openai):
        """Test quiz generation with API error"""
        # Mock the OpenAI client to raise an exception
        mock_client = MagicMock()
        mock_openai.return_value = mock_client
        mock_client.chat.completions.create.side_effect = Exception("API Error")

        # Generate questions
        questions = generate_quiz_questions("Geography", "easy", 2)
        
        # Should return default questions
        self.assertEqual(len(questions), 2)
        self.assertTrue("Error occurred" in questions[0]["text"])

    def test_grade_quiz_exact_matches(self):
        """Test quiz grading with exact matches"""
        user_answers = ["Paris", "4"]
        correct_answers = ["Paris", "4"]
        
        score = grade_quiz(user_answers, correct_answers)
        
        self.assertEqual(score, 2)

    def test_grade_quiz_case_insensitive(self):
        """Test quiz grading with case-insensitive matching"""
        user_answers = ["paris", "4"]
        correct_answers = ["Paris", "4"]
        
        score = grade_quiz(user_answers, correct_answers)
        
        self.assertEqual(score, 2)

    def test_grade_quiz_partial_matches(self):
        """Test quiz grading with partial matches"""
        user_answers = ["Paris", "5"]
        correct_answers = ["Paris", "4"]
        
        score = grade_quiz(user_answers, correct_answers)
        
        self.assertEqual(score, 1)

    def test_grade_quiz_different_lengths(self):
        """Test quiz grading with different length answer lists"""
        user_answers = ["Paris"]
        correct_answers = ["Paris", "4"]
        
        score = grade_quiz(user_answers, correct_answers)
        
        self.assertEqual(score, 1)
