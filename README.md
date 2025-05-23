# Quiz Application

A full-stack quiz application built with Django, React, and OpenAI integration.

## Project Structure

```
quizz_app/
├── backend/           # Django backend
│   ├── quizzes/      # Main Django app
│   └── quizz_project/ # Django project settings
├── frontend/         # React frontend
└── .github/         # GitHub Actions workflows
```

## Features

- Quiz generation using OpenAI API
- User authentication
- Quiz taking and scoring
- Real-time feedback
- Responsive design

## Setup

### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
Create a `apis.env` file with:
```
OPENAI_API_KEY=your_api_key_here
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Start the server:
```bash
python manage.py runserver
```

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Docker Deployment

The application can be deployed using Docker:

```bash
# Build and start containers
docker-compose up --build
```

## CI/CD

The project uses GitHub Actions for continuous integration and deployment:

- Backend CI/CD: Tests, builds, and deploys the Django application
- Frontend CI/CD: Tests, builds, and deploys the React application

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 