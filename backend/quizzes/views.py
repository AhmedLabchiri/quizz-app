from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import Quiz, Question, UserQuizHistory
from .serializers import (
    QuizSerializer, 
    QuestionSerializer, 
    UserQuizHistorySerializer,
    QuizCreateSerializer,
    UserSerializer
)
from .quiz_service import generate_quiz_questions, grade_quiz
import json
from django.http import HttpResponse
from datetime import datetime
from django.db import models

class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows quizzes to be viewed.
    """
    queryset = Quiz.objects.all().order_by('-created_at')
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

class QuizHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows quiz history to be viewed.
    """
    serializer_class = UserQuizHistorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = UserQuizHistory.objects.filter(user=self.request.user).order_by('-completed_at')
        
        # If accessed through certificates endpoint, only return entries with certificates
        if self.action == 'list' and 'certificates' in self.request.path:
            # Get all quiz histories
            histories = queryset.select_related('quiz').prefetch_related('quiz__questions')
            
            # Filter for certificates (score >= 80%)
            certificate_histories = []
            for history in histories:
                total_questions = history.quiz.questions.count()
                if total_questions > 0:
                    score_percentage = (history.score / total_questions) * 100
                    if score_percentage >= 80:
                        certificate_histories.append(history.id)
            
            return queryset.filter(id__in=certificate_histories)
        
        return queryset

class GenerateQuizView(APIView):
    """
    API endpoint to generate a new quiz.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = QuizCreateSerializer(data=request.data)
        if serializer.is_valid():
            # Create the quiz
            quiz = serializer.save()
            
            # Generate questions
            questions_data = generate_quiz_questions(
                quiz.subject, 
                quiz.difficulty
            )
            
            # Save the questions
            for question_data in questions_data:
                Question.objects.create(
                    quiz=quiz,
                    text=question_data['text'],
                    answer=question_data['answer']
                )
            
            # Return the full quiz with questions
            return Response(QuizSerializer(quiz).data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SubmitQuizView(APIView):
    """
    API endpoint to submit quiz answers and get a grade.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, quiz_id):
        try:
            # Get the quiz
            quiz = Quiz.objects.get(pk=quiz_id)
            
            # Get user answers from request
            user_answers = request.data.get('answers', [])
            
            # Get correct answers from the database
            questions = Question.objects.filter(quiz=quiz)
            correct_answers = [question.answer for question in questions]
            
            # Grade the quiz
            score = grade_quiz(user_answers, correct_answers)
            
            # Save the quiz result
            history = UserQuizHistory.objects.create(
                user=request.user,
                quiz=quiz,
                score=score
            )
            
            # Return the result
            return Response({
                'score': score,
                'total': len(correct_answers),
                'history_id': history.id
            }, status=status.HTTP_200_OK)
            
        except Quiz.DoesNotExist:
            return Response({'error': 'Quiz not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(APIView):
    """
    API endpoint for user registration.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        try:
            email = request.data.get('email')
            password = request.data.get('password')
            
            if not email or not password:
                return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if email already exists
            if User.objects.filter(email=email).exists():
                return Response({'error': 'Email already in use'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create username from email (before the @ symbol)
            username = email.split('@')[0]
            
            # Create new user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            
            # Create token for the user
            token = Token.objects.create(user=user)
            
            return Response({
                'success': 'User registered successfully',
                'token': token.key,
                'user': {
                    'email': user.email,
                    'username': user.username
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CustomAuthToken(APIView):
    """
    Custom token authentication view that uses email instead of username.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({'error': 'Please provide both email and password'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Find user by email
            user = User.objects.get(email=email)
            
            # Authenticate user
            user = authenticate(username=user.username, password=password)
            
            if user:
                # Get or create token
                token, _ = Token.objects.get_or_create(user=user)
                return Response({
                    'token': token.key,
                    'user': {
                        'email': user.email,
                        'username': user.username
                    }
                })
            else:
                return Response({'error': 'Invalid credentials'}, 
                              status=status.HTTP_401_UNAUTHORIZED)
                
        except User.DoesNotExist:
            return Response({'error': 'No user found with this email'}, 
                          status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, 
                          status=status.HTTP_400_BAD_REQUEST)

class DownloadCertificateView(APIView):
    """
    API endpoint to download a certificate for a completed quiz.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, history_id):
        try:
            # Get the quiz history entry
            history = UserQuizHistory.objects.get(
                id=history_id,
                user=request.user
            )
            
            # Calculate score percentage
            score_percentage = (history.score / history.quiz.questions.count()) * 100
            
            # Only allow download if score is 80% or higher
            if score_percentage < 80:
                return Response(
                    {'error': 'Certificate not available for scores below 80%'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Create certificate data
            certificate_data = {
                'user_name': request.user.username,
                'quiz_subject': history.quiz.subject,
                'score': score_percentage,
                'date': history.completed_at.strftime('%Y-%m-%d'),
                'certificate_id': f'CERT-{history.id:06d}'
            }
            
            # Convert to JSON
            certificate_json = json.dumps(certificate_data, indent=2)
            
            # Create response with certificate data
            response = HttpResponse(
                certificate_json,
                content_type='application/json'
            )
            
            # Set filename for download
            filename = f'certificate_{history.quiz.subject.lower().replace(" ", "_")}_{history.completed_at.strftime("%Y%m%d")}.json'
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            
            return response
            
        except UserQuizHistory.DoesNotExist:
            return Response(
                {'error': 'Certificate not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
