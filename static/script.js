document.addEventListener('DOMContentLoaded', () => {
    // Trending Videos
    const trendingBtn = document.getElementById('trending-btn');
    const trendingResults = document.getElementById('trending-results');

    trendingBtn.addEventListener('click', () => {
        fetch('/api/trending_videos')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                displayError(trendingResults, data.error);
            } else {
                displayTrendingVideos(trendingResults, data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayError(trendingResults, 'An error occurred.');
        });
    });

    function displayTrendingVideos(element, videos) {
        element.innerHTML = ''; // Clear previous results
        videos.forEach(video => {
            const videoCard = document.createElement('div');
            videoCard.className = 'video-card';
            videoCard.innerHTML = `
                <a href="https://www.youtube.com/watch?v=${video.videoId}" target="_blank" style="text-decoration: none; color: inherit;">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <h3>${video.title}</h3>
                </a>
                <p><strong>Channel:</strong> ${video.channelTitle}</p>
                <p><strong>Views:</strong> ${video.viewCount}</p>
                <p><strong>Likes:</strong> ${video.likeCount}</p>
            `;
            element.appendChild(videoCard);
        });
    }

    // Channel Analytics
    const channelAnalyticsBtn = document.getElementById('channel-analytics-btn');
    const channelIdInput = document.getElementById('channel-id-input');
    const channelAnalyticsResults = document.getElementById('channel-analytics-results');

    channelAnalyticsBtn.addEventListener('click', () => {
        const channelId = channelIdInput.value.trim();
        if (channelId) {
            fetch('/api/channel_analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ channel_id: channelId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    displayError(channelAnalyticsResults, data.error);
                } else {
                    displayChannelAnalytics(channelAnalyticsResults, data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                displayError(channelAnalyticsResults, 'An error occurred.');
            });
        }
    });

    function displayChannelAnalytics(element, analytics) {
        element.innerHTML = `
            <div class="channel-card" style="display: flex; align-items: center;">
                <img src="${analytics.thumbnail}" alt="${analytics.title}" style="width: 80px; height: 80px; border-radius: 50%; margin-right: 1rem;">
                <div class="channel-info">
                    <h3>${analytics.title}</h3>
                    <p><strong>Subscribers:</strong> ${analytics.subscriberCount}</p>
                    <p><strong>Total Views:</strong> ${analytics.viewCount}</p>
                    <p><strong>Total Videos:</strong> ${analytics.videoCount}</p>
                </div>
            </div>
            <p style="margin-top: 1rem;">${analytics.description.substring(0, 300)}...</p>
        `;
    }

    // Video Details Explorer
    const videoDetailsBtn = document.getElementById('video-details-btn');
    const videoIdInput = document.getElementById('video-id-input');
    const videoDetailsResults = document.getElementById('video-details-results');

    videoDetailsBtn.addEventListener('click', () => {
        const videoId = videoIdInput.value.trim();
        if (videoId) {
            fetch('/api/video_details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ video_id: videoId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    displayError(videoDetailsResults, data.error);
                } else {
                    displayVideoDetails(videoDetailsResults, data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                displayError(videoDetailsResults, 'An error occurred.');
            });
        }
    });

    function displayVideoDetails(element, details) {
        // Helper function to format the ISO 8601 duration
        const formatDuration = (isoDuration) => {
            const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
            const matches = isoDuration.match(regex);
            const hours = parseInt(matches[1] || 0);
            const minutes = parseInt(matches[2] || 0);
            const seconds = parseInt(matches[3] || 0);
            if(hours > 0) {
                return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        };

        element.innerHTML = `
            <h4>${details.title}</h4>
            <div class="video-stats" style="display: flex; justify-content: space-around; flex-wrap: wrap; margin-bottom: 1rem; background: #fdfdfd; padding: 0.5rem; border-radius: 5px;">
                <p><strong>Views:</strong> ${details.viewCount}</p>
                <p><strong>Likes:</strong> ${details.likeCount}</p>
                <p><strong>Comments:</strong> ${details.commentCount}</p>
                <p><strong>Duration:</strong> ${formatDuration(details.duration)}</p>
                <p><strong>Definition:</strong> ${details.definition}</p>
            </div>
            <h5>Tags:</h5>
            <div class="tags-container" style="margin-bottom: 1rem;">
                ${details.tags.map(tag => `<span class="tag" style="background-color: #e9ecef; padding: 0.3rem 0.6rem; border-radius: 3px; margin: 0.2rem; display: inline-block;">${tag}</span>`).join('')}
            </div>
            <h5>Description:</h5>
            <p class="description" style="white-space: pre-wrap; background: #fdfdfd; padding: 1rem; border-radius: 5px;">${details.description}</p>
        `;
    }

    // Keyword Research Tool
    const keywordBtn = document.getElementById('keyword-btn');
    const keywordInput = document.getElementById('keyword-input');
    const keywordResults = document.getElementById('keyword-results');

    keywordBtn.addEventListener('click', () => {
        const keyword = keywordInput.value.trim();
        if (keyword) {
            fetch('/api/keyword_research', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ keyword: keyword })
            })
            .then(response => response.json())
            .then(data => {
                displayResults(keywordResults, data);
            })
            .catch(error => {
                console.error('Error:', error);
                displayError(keywordResults, 'An error occurred.');
            });
        }
    });

    // AI Title Generator
    const titleBtn = document.getElementById('title-btn');
    const titleTopicInput = document.getElementById('title-topic-input');
    const titleResults = document.getElementById('title-results');

    titleBtn.addEventListener('click', () => {
        const topic = titleTopicInput.value.trim();
        if (topic) {
            fetch('/api/title_generator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ topic: topic })
            })
            .then(response => response.json())
            .then(data => {
                displayResults(titleResults, data);
            })
            .catch(error => {
                console.error('Error:', error);
                displayError(titleResults, 'An error occurred.');
            });
        }
    });

    // Video Idea Generator
    const ideaBtn = document.getElementById('idea-btn');
    const ideaTopicInput = document.getElementById('idea-topic-input');
    const ideaResults = document.getElementById('idea-results');

    ideaBtn.addEventListener('click', () => {
        const topic = ideaTopicInput.value.trim();
        if (topic) {
            fetch('/api/idea_generator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ topic: topic })
            })
            .then(response => response.json())
            .then(data => {
                displayResults(ideaResults, data);
            })
            .catch(error => {
                console.error('Error:', error);
                displayError(ideaResults, 'An error occurred.');
            });
        }
    });

    // Hashtag Generator
    const hashtagBtn = document.getElementById('hashtag-btn');
    const hashtagInput = document.getElementById('hashtag-input');
    const hashtagResults = document.getElementById('hashtag-results');

    hashtagBtn.addEventListener('click', () => {
        const text = hashtagInput.value.trim();
        if (text) {
            fetch('/api/hashtag_generator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: text })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    displayError(hashtagResults, data.error);
                } else {
                    hashtagResults.innerHTML = `<p>${data.hashtags}</p>`;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                displayError(hashtagResults, 'An error occurred.');
            });
        }
    });

    // AI Description & Tag Recommendations
    const descTagsBtn = document.getElementById('desc-tags-btn');
    const descTagsTopicInput = document.getElementById('desc-tags-topic-input');
    const descTagsResults = document.getElementById('desc-tags-results');

    descTagsBtn.addEventListener('click', () => {
        const topic = descTagsTopicInput.value.trim();
        if (topic) {
            fetch('/api/ai_description_tags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ topic: topic })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    displayError(descTagsResults, data.error);
                } else {
                    displayDescriptionAndTags(descTagsResults, data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                displayError(descTagsResults, 'An error occurred.');
            });
        }
    });

    function displayDescriptionAndTags(element, data) {
        element.innerHTML = `
            <h5>Generated Description:</h5>
            <p class="description" style="white-space: pre-wrap; background: #fdfdfd; padding: 1rem; border-radius: 5px;">${data.description}</p>
            <h5 style="margin-top: 1rem;">Generated Tags:</h5>
            <div class="tags-container">
                ${data.tags.map(tag => `<span class="tag" style="background-color: #e9ecef; padding: 0.3rem 0.6rem; border-radius: 3px; margin: 0.2rem; display: inline-block;">${tag}</span>`).join('')}
            </div>
        `;
    }

    function displayResults(element, data) {
        if (data.error) {
            displayError(element, data.error);
            return;
        }
        element.innerHTML = '<ul>' + data.map(item => `<li>${item}</li>`).join('') + '</ul>';
    }

    function displayError(element, message) {
        element.innerHTML = `<p style="color: red;">${message}</p>`;
    }
});
