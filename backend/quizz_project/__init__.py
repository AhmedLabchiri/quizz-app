import os
from dotenv import load_dotenv

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 👉 Load from the custom file name
load_dotenv(dotenv_path=os.path.join(BASE_DIR, 'apis.env'))

# Now you can safely access your variables like this:
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
