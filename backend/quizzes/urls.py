from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'quizzes', views.QuizViewSet)
router.register(r'history', views.QuizHistoryViewSet, basename='history')

urlpatterns = [
    path('', include(router.urls)),
    path('generate/', views.GenerateQuizView.as_view(), name='generate-quiz'),
    path('submit/<int:quiz_id>/', views.SubmitQuizView.as_view(), name='submit-quiz'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('token-auth/', views.CustomAuthToken.as_view(), name='api_token_auth'),
    path('certificates/', views.QuizHistoryViewSet.as_view({'get': 'list'}), name='certificates-list'),
    path('certificates/download/<int:history_id>/', views.DownloadCertificateView.as_view(), name='download-certificate'),
] 