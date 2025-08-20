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
        prompt = f"You are a YouTube expert specializing in viral titles. Based on the following topic or draft title, generate 5 improved, catchy, and SEO-optimized alternative video titles. Here is the input: '{topic}'"
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


@app.route('/api/trending_videos', methods=['GET'])
def trending_videos():
    if not YOUTUBE_API_KEY:
        return jsonify({'error': 'YouTube API key is not configured. Please set the YOUTUBE_API_KEY environment variable.'}), 500

    try:
        youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
        request = youtube.videos().list(
            part="snippet,contentDetails,statistics",
            chart="mostPopular",
            regionCode="US",  # Defaulting to US, can be parameterized later
            maxResults=12
        )
        response = request.execute()

        trending_videos = []
        for item in response.get('items', []):
            video_data = {
                'title': item['snippet']['title'],
                'channelTitle': item['snippet']['channelTitle'],
                'thumbnail': item['snippet']['thumbnails']['medium']['url'],
                'viewCount': item['statistics'].get('viewCount', 'N/A'),
                'likeCount': item['statistics'].get('likeCount', 'N/A'),
                'videoId': item['id']
            }
            trending_videos.append(video_data)

        return jsonify(trending_videos)
    except Exception as e:
        app.logger.error(f"An error occurred with the YouTube API: {e}")
        return jsonify({'error': 'An error occurred while fetching trending videos.'}), 500


@app.route('/api/channel_analytics', methods=['POST'])
def channel_analytics():
    if not YOUTUBE_API_KEY:
        return jsonify({'error': 'YouTube API key is not configured. Please set the YOUTUBE_API_KEY environment variable.'}), 500

    data = request.get_json()
    channel_id = data.get('channel_id')
    if not channel_id:
        return jsonify({'error': 'Channel ID is required'}), 400

    try:
        youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
        request = youtube.channels().list(
            part="snippet,contentDetails,statistics",
            id=channel_id
        )
        response = request.execute()

        if not response.get('items'):
            return jsonify({'error': 'Channel not found.'}), 404

        channel_data = response['items'][0]

        analytics = {
            'title': channel_data['snippet']['title'],
            'description': channel_data['snippet']['description'],
            'thumbnail': channel_data['snippet']['thumbnails']['medium']['url'],
            'subscriberCount': channel_data['statistics'].get('subscriberCount', 'N/A'),
            'viewCount': channel_data['statistics'].get('viewCount', 'N/A'),
            'videoCount': channel_data['statistics'].get('videoCount', 'N/A'),
        }

        return jsonify(analytics)
    except Exception as e:
        app.logger.error(f"An error occurred with the YouTube API: {e}")
        return jsonify({'error': 'An error occurred while fetching channel analytics.'}), 500


@app.route('/api/video_details', methods=['POST'])
def video_details():
    if not YOUTUBE_API_KEY:
        return jsonify({'error': 'YouTube API key is not configured. Please set the YOUTUBE_API_KEY environment variable.'}), 500

    data = request.get_json()
    video_id = data.get('video_id')
    if not video_id:
        return jsonify({'error': 'Video ID is required'}), 400

    try:
        youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
        request = youtube.videos().list(
            part="snippet,contentDetails,statistics,topicDetails",
            id=video_id
        )
        response = request.execute()

        if not response.get('items'):
            return jsonify({'error': 'Video not found.'}), 404

        video_data = response['items'][0]

        details = {
            'title': video_data['snippet']['title'],
            'description': video_data['snippet']['description'],
            'tags': video_data['snippet'].get('tags', []),
            'categoryId': video_data['snippet']['categoryId'],
            'viewCount': video_data['statistics'].get('viewCount', 'N/A'),
            'likeCount': video_data['statistics'].get('likeCount', 'N/A'),
            'commentCount': video_data['statistics'].get('commentCount', 'N/A'),
            'duration': video_data['contentDetails']['duration'],
            'definition': video_data['contentDetails']['definition'],
            'topicCategories': video_data.get('topicDetails', {}).get('topicCategories', [])
        }

        return jsonify(details)
    except Exception as e:
        app.logger.error(f"An error occurred with the YouTube API: {e}")
        return jsonify({'error': 'An error occurred while fetching video details.'}), 500


@app.route('/api/ai_description_tags', methods=['POST'])
def ai_description_tags():
    if not GEMINI_API_KEY:
        return jsonify({'error': 'Gemini API key is not configured. Please set the GEMINI_API_KEY environment variable.'}), 500

    data = request.get_json()
    topic = data.get('topic')
    if not topic:
        return jsonify({'error': 'Topic is required'}), 400

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"""
        Generate a YouTube video description and a list of relevant tags for a video about: "{topic}".

        Please return the output in a JSON format with two keys: "description" and "tags".
        The "description" should be a well-written, engaging paragraph of about 100-150 words.
        The "tags" should be a list of 10-15 relevant keywords.

        Example:
        {{
          "description": "In this video, we explore the best techniques for landscape photography...",
          "tags": ["landscape photography", "photography tips", "nature photography", "camera settings", "long exposure"]
        }}
        """
        response = model.generate_content(prompt)

        import json
        # Clean the response to ensure it's valid JSON
        text_response = response.text
        start = text_response.find('{')
        end = text_response.rfind('}') + 1
        json_str = text_response[start:end]
        json_response = json.loads(json_str)

        return jsonify(json_response)
    except Exception as e:
        app.logger.error(f"An error occurred with the Gemini API: {e}")
        return jsonify({'error': 'An error occurred while generating description and tags.'}), 500


@app.route('/api/channel_audit', methods=['POST'])
def channel_audit():
    if not YOUTUBE_API_KEY:
        return jsonify({'error': 'YouTube API key is not configured. Please set the YOUTUBE_API_KEY environment variable.'}), 500

    data = request.get_json()
    channel_id = data.get('channel_id')
    if not channel_id:
        return jsonify({'error': 'Channel ID is required'}), 400

    try:
        youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

        # 1. Get Channel Statistics
        channel_request = youtube.channels().list(
            part="snippet,statistics",
            id=channel_id
        )
        channel_response = channel_request.execute()

        if not channel_response.get('items'):
            return jsonify({'error': 'Channel not found.'}), 404

        channel_data = channel_response['items'][0]
        stats = channel_data['statistics']
        subscriber_count = int(stats.get('subscriberCount', 0))
        view_count = int(stats.get('viewCount', 0))
        video_count = int(stats.get('videoCount', 0))

        # 2. Get Recent Videos
        recent_videos_request = youtube.search().list(
            part="snippet",
            channelId=channel_id,
            order="date",
            maxResults=5,
            type="video"
        )
        recent_videos_response = recent_videos_request.execute()
        recent_videos = [
            {'title': item['snippet']['title'], 'videoId': item['id']['videoId']}
            for item in recent_videos_response.get('items', [])
        ]

        # 3. Get Popular Videos
        popular_videos_request = youtube.search().list(
            part="snippet",
            channelId=channel_id,
            order="viewCount",
            maxResults=5,
            type="video"
        )
        popular_videos_response = popular_videos_request.execute()
        popular_videos = [
            {'title': item['snippet']['title'], 'videoId': item['id']['videoId']}
            for item in popular_videos_response.get('items', [])
        ]

        # 4. Calculate Average Views
        average_views = view_count / video_count if video_count > 0 else 0

        audit_results = {
            'title': channel_data['snippet']['title'],
            'thumbnail': channel_data['snippet']['thumbnails']['medium']['url'],
            'subscriberCount': subscriber_count,
            'viewCount': view_count,
            'videoCount': video_count,
            'averageViews': round(average_views),
            'recentVideos': recent_videos,
            'popularVideos': popular_videos
        }

        return jsonify(audit_results)
    except Exception as e:
        app.logger.error(f"An error occurred with the YouTube API: {e}")
        return jsonify({'error': 'An error occurred while performing the channel audit.'}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
