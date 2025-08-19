import os
import logging
from flask import Flask, render_template, request, jsonify
from googleapiclient.discovery import build
import google.generativeai as genai

# Configure logging
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)

# --- API Key Configuration ---
# NOTE TO USER: Please set the following environment variables on your machine.
#
# For the AI features (Title and Idea Generator):
# export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
#
# For the Keyword Research Tool:
# export YOUTUBE_API_KEY="YOUR_YOUTUBE_API_KEY"

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
YOUTUBE_API_KEY = os.environ.get('YOUTUBE_API_KEY')

if not GEMINI_API_KEY:
    app.logger.warning("GEMINI_API_KEY environment variable not set. AI features will not work.")
else:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
    except Exception as e:
        app.logger.error(f"Failed to configure Gemini AI: {e}")

if not YOUTUBE_API_KEY:
    app.logger.warning("YOUTUBE_API_KEY environment variable not set. Keyword Research feature will not work.")


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/keyword_research', methods=['POST'])
def keyword_research():
    if not YOUTUBE_API_KEY:
        return jsonify({'error': 'YouTube API key is not configured. Please set the YOUTUBE_API_KEY environment variable.'}), 500

    data = request.get_json()
    keyword = data.get('keyword')
    if not keyword:
        return jsonify({'error': 'Keyword is required'}), 400

    try:
        youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
        search_response = youtube.search().list(
            q=keyword,
            part='snippet',
            maxResults=10,
            type='video'
        ).execute()

        related_keywords = [item['snippet']['title'] for item in search_response.get('items', [])]
        return jsonify(related_keywords)
    except Exception as e:
        app.logger.error(f"An error occurred with the YouTube API: {e}")
        return jsonify({'error': 'An error occurred with the YouTube API. Please check your key and quota.'}), 500

@app.route('/api/title_generator', methods=['POST'])
def title_generator():
    if not GEMINI_API_KEY:
        return jsonify({'error': 'Gemini API key is not configured. Please set the GEMINI_API_KEY environment variable.'}), 500

    data = request.get_json()
    topic = data.get('topic')
    if not topic:
        return jsonify({'error': 'Topic is required'}), 400

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"Generate 5 catchy YouTube titles for a video about {topic}."
        response = model.generate_content(prompt)
        titles = response.text.strip().split('\n')
        return jsonify(titles)
    except Exception as e:
        app.logger.error(f"An error occurred with the Gemini API: {e}")
        return jsonify({'error': 'An error occurred with the Gemini API. Please check your key.'}), 500


@app.route('/api/idea_generator', methods=['POST'])
def idea_generator():
    if not GEMINI_API_KEY:
        return jsonify({'error': 'Gemini API key is not configured. Please set the GEMINI_API_KEY environment variable.'}), 500

    data = request.get_json()
    topic = data.get('topic')
    if not topic:
        return jsonify({'error': 'Topic is required'}), 400

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"Generate 5 creative YouTube video ideas about {topic}."
        response = model.generate_content(prompt)
        ideas = response.text.strip().split('\n')
        return jsonify(ideas)
    except Exception as e:
        app.logger.error(f"An error occurred with the Gemini API: {e}")
        return jsonify({'error': 'An error occurred with the Gemini API. Please check your key.'}), 500


@app.route('/api/hashtag_generator', methods=['POST'])
def hashtag_generator():
    if not GEMINI_API_KEY:
        return jsonify({'error': 'Gemini API key is not configured. Please set the GEMINI_API_KEY environment variable.'}), 500

    data = request.get_json()
    text = data.get('text')
    if not text:
        return jsonify({'error': 'Text is required'}), 400

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"Generate a list of 10-15 relevant and trending YouTube hashtags for a video with the following title/description:\n\n{text}\n\nReturn the hashtags as a single line of space-separated text, each starting with a '#' symbol."
        response = model.generate_content(prompt)
        hashtags = response.text.strip()
        return jsonify({'hashtags': hashtags})
    except Exception as e:
        app.logger.error(f"An error occurred with the Gemini API: {e}")
        return jsonify({'error': 'An error occurred with the Gemini API. Please check your key.'}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
