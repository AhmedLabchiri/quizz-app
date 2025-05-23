import openai
import json
from django.conf import settings

# Ensure we're using a compatible version of the OpenAI SDK
if not hasattr(openai, 'OpenAI'):
    raise ImportError("This code requires OpenAI Python SDK v1.0.0 or higher. Please upgrade using: pip install --upgrade openai")

def test_openai_connection():
    """
    Test the OpenAI API connection and key.
    Returns:
        tuple: (bool, str) - (success status, message)
    """
    try:
        client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Say 'test successful' if you can read this."}],
            max_tokens=5
        )
        return True, "OpenAI API connection successful!"
    except Exception as e:
        return False, f"OpenAI API connection failed: {str(e)}"

def generate_quiz_questions(subject, difficulty, num_questions=10):
    """
    Generate quiz questions using OpenAI API based on the subject and difficulty.
    
    Args:
        subject (str): The subject of the quiz
        difficulty (str): The difficulty level (easy, medium, hard)
        num_questions (int): Number of questions to generate (default: 10)
        
    Returns:
        list: A list of dictionaries with question text and answer
    """
    try:
        print(f"Generating quiz for subject: {subject}, difficulty: {difficulty}")
        client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        
        # Create a system prompt based on difficulty
        difficulty_descriptions = {
            'easy': 'basic knowledge questions that most beginners would know',
            'medium': 'intermediate level questions requiring good understanding of the subject',
            'hard': 'advanced questions that only experts would likely know'
        }
        
        system_prompt = f"""
        You are an expert quiz creator. Create {num_questions} quiz questions about {subject}.
        The questions should be {difficulty_descriptions.get(difficulty, 'moderate difficulty')}.
        
        Return the response in this exact JSON format:
        {{
            "questions": [
                {{
                    "text": "Question text here",
                    "answer": "Correct answer here"
                }},
                ...
            ]
        }}
        
        Be concise and clear in both questions and answers.
        """
        
        print("Sending request to OpenAI API...")
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Generate {num_questions} {difficulty} questions about {subject}"}
            ],
            response_format={"type": "json_object"}
        )
        
        print("Received response from OpenAI API")
        content = response.choices[0].message.content
        print(f"Raw response: {content[:200]}...")  # Print first 200 chars of response
        
        try:
            questions_data = json.loads(content)
            print(f"Parsed JSON successfully. Keys found: {list(questions_data.keys())}")
            
            if 'questions' in questions_data:
                questions = questions_data['questions']
                print(f"Successfully extracted {len(questions)} questions")
                return questions
            else:
                print("No 'questions' key found in response. Available keys:", list(questions_data.keys()))
                # Try to adapt the response if it's in a different format
                if isinstance(questions_data, list):
                    return questions_data
                else:
                    raise ValueError("Response format not recognized")
                    
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON response: {e}")
            print(f"Raw content: {content}")
            raise
            
    except Exception as e:
        print(f"Error in generate_quiz_questions: {str(e)}")
        # Return a default set of questions in case of error
        return [
            {"text": f"Sample question about {subject} (Error occurred: {str(e)})", "answer": "Sample answer"}
        ] * num_questions

def grade_quiz(user_answers, correct_answers):
    """
    Grade a quiz by comparing user answers with correct answers.
    
    Args:
        user_answers (list): List of user's answers
        correct_answers (list): List of correct answers
        
    Returns:
        int: Score out of total questions
    """
    score = 0
    total_questions = min(len(user_answers), len(correct_answers))
    
    # First pass: exact matches
    for i in range(total_questions):
        if user_answers[i].lower() == correct_answers[i].lower():
            score += 1
            
    return score 