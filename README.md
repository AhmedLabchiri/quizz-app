# Quiz Generation Application

An AI-powered quiz application built with Django, React, and Firebase. This application lets users generate quizzes on any subject using AI, take quizzes, and track their progress over time.

## Features

- User authentication with Firebase
- AI-generated quizzes on any subject
- Quiz difficulty selection (easy, medium, hard)
- Quiz submission and automatic grading
- History of past quizzes
- Score tracking and statistics

## Technology Stack

- **Backend**: Django, Django REST Framework
- **Frontend**: React, Bootstrap
- **Authentication**: Firebase Authentication
- **AI Integration**: OpenAI API

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd quizz_app/backend
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Apply migrations:
   ```
   python manage.py migrate
   ```

4. Create an admin user:
   ```
   python manage.py createsuperuser
   ```

5. Run the development server:
   ```
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd quizz_app/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm start
   ```

## Usage

1. Register a new account or log in
2. From the dashboard, click "Create New Quiz"
3. Enter a subject and select a difficulty level
4. Answer the 10 generated questions
5. Submit the quiz to see your score and correct answers
6. View your quiz history to track progress

## API Endpoints

- `/api/register/` - User registration
- `/api-token-auth/` - User authentication
- `/api/quizzes/` - List all quizzes
- `/api/generate/` - Generate a new quiz
- `/api/submit/<quiz_id>/` - Submit quiz answers
- `/api/history/` - View quiz history

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
OPENAI_API_KEY=your_openai_api_key
SECRET_KEY=your_django_secret_key
DEBUG=True
``` 