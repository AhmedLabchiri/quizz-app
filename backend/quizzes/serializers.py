from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Quiz, Question, UserQuizHistory

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
        extra_kwargs = {'password': {'write_only': True}}

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'text', 'answer']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Quiz
        fields = ['id', 'subject', 'difficulty', 'created_at', 'questions']

class UserQuizHistorySerializer(serializers.ModelSerializer):
    quiz = QuizSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    score_percentage = serializers.SerializerMethodField()
    has_certificate = serializers.SerializerMethodField()
    
    class Meta:
        model = UserQuizHistory
        fields = ['id', 'user', 'quiz', 'score', 'completed_at', 'score_percentage', 'has_certificate']
    
    def get_score_percentage(self, obj):
        total_questions = obj.quiz.questions.count()
        if total_questions > 0:
            return round((obj.score / total_questions) * 100)
        return 0
    
    def get_has_certificate(self, obj):
        return self.get_score_percentage(obj) >= 80

class QuizCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['subject', 'difficulty'] 