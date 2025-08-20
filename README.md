# VidIQ Clone MVP

This is a Minimum Viable Product (MVP) of a VidIQ-like application. It provides a web-based interface for three tools designed to help YouTube creators.

## Features

- **Keyword Research:** Enter a keyword to get a list of related video titles from YouTube.
- **AI Title Generator:** Provide a topic to get a list of AI-generated video titles.
- **Video Idea Generator:** Provide a topic to get a list of AI-generated video ideas.

## Local Setup Guide

### 1. Prerequisites

Make sure you have Python 3 installed on your machine. You can check by opening your terminal and running:
```bash
python3 --version
```

### 2. Clone the Repository

Clone this repository to your local machine.

### 3. Install Dependencies

Install the necessary Python libraries by running the following command in the project's root directory:
```bash
pip3 install -r requirements.txt
```

### 4. Set API Keys

This application requires API keys for the YouTube Data API and the Gemini AI API. You need to set these as environment variables.

In your terminal, run the following commands, replacing the placeholder text with your actual keys:
```bash
export YOUTUBE_API_KEY="YOUR_YOUTUBE_API_KEY"
export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

**Note:** For a more permanent solution, you can add these `export` commands to your shell's profile file (e.g., `~/.bash_profile`, `~/.zshrc`).

### 5. Run the Application

Once the dependencies are installed and the API keys are set, run the application with the following command:
```bash
python3 app.py
```

The application will be running and accessible at `http://localhost:8080`.

## Project Structure
```
.
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── static/
│   ├── script.js       # Frontend JavaScript
│   └── style.css       # CSS for styling
└── templates/
    └── index.html      # Main HTML template
```

## Deployment

This application is ready to be deployed to most modern hosting platforms that support Python, such as Heroku or Render.

### General Deployment Steps:

1.  **Create a new app** on your chosen hosting platform.
2.  **Connect your GitHub repository** to the hosting platform.
3.  **Configure Environment Variables**: On your hosting platform's dashboard, you will need to set the following environment variables. Do not put your secret keys directly in the code.
    *   `GOOGLE_CLIENT_ID`
    *   `GOOGLE_CLIENT_SECRET`
    *   `YOUTUBE_API_KEY`
    *   `GEMINI_API_KEY`
4.  **Trigger a deployment**: The hosting service should automatically detect the `Procfile` and install the dependencies from `requirements.txt`. It will then start the application using the `gunicorn` server.

The application should then be live at the URL provided by your hosting service.
