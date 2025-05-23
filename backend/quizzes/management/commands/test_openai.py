from django.core.management.base import BaseCommand
from quizzes.quiz_service import test_openai_connection

class Command(BaseCommand):
    help = 'Test the OpenAI API connection'

    def handle(self, *args, **options):
        success, message = test_openai_connection()
        if success:
            self.stdout.write(self.style.SUCCESS(message))
        else:
            self.stdout.write(self.style.ERROR(message)) 