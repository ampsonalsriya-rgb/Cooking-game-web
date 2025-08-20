document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const showLoader = () => loader.style.display = 'block';
    const hideLoader = () => loader.style.display = 'none';

    // Trending Videos
    const trendingBtn = document.getElementById('trending-btn');
    const trendingResults = document.getElementById('trending-results');

    trendingBtn.addEventListener('click', () => {
        showLoader();
        trendingResults.innerHTML = '';
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
        })
        .finally(() => hideLoader());
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
            showLoader();
            channelAnalyticsResults.innerHTML = '';
            fetch('/api/channel_analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            })
            .finally(() => hideLoader());
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

    // Channel Audit Tool
    const channelAuditBtn = document.getElementById('channel-audit-btn');
    const auditChannelIdInput = document.getElementById('audit-channel-id-input');
    const channelAuditResults = document.getElementById('channel-audit-results');

    channelAuditBtn.addEventListener('click', () => {
        const channelId = auditChannelIdInput.value.trim();
        if (channelId) {
            showLoader();
            channelAuditResults.innerHTML = '';
            fetch('/api/channel_audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ channel_id: channelId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    displayError(channelAuditResults, data.error);
                } else {
                    displayChannelAudit(channelAuditResults, data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                displayError(channelAuditResults, 'An error occurred.');
            })
            .finally(() => hideLoader());
        }
    });

    function displayChannelAudit(element, audit) {
        element.innerHTML = `
            <div class="channel-card" style="display: flex; align-items: center; margin-bottom: 1rem;">
                <img src="${audit.thumbnail}" alt="${audit.title}" style="width: 80px; height: 80px; border-radius: 50%; margin-right: 1rem;">
                <div class="channel-info">
                    <h3>${audit.title}</h3>
                </div>
            </div>
            <div class="video-stats" style="display: flex; justify-content: space-around; flex-wrap: wrap; margin-bottom: 1rem; background: #fdfdfd; padding: 0.5rem; border-radius: 5px;">
                <p><strong>Subscribers:</strong> ${audit.subscriberCount.toLocaleString()}</p>
                <p><strong>Total Views:</strong> ${audit.viewCount.toLocaleString()}</p>
                <p><strong>Total Videos:</strong> ${audit.videoCount.toLocaleString()}</p>
                <p><strong>Average Views:</strong> ${audit.averageViews.toLocaleString()}</p>
            </div>
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="width: 48%; min-width: 250px;">
                    <h5>Recent Videos:</h5>
                    <ul>
                        ${audit.recentVideos.map(video => `<li><a href="https://www.youtube.com/watch?v=${video.videoId}" target="_blank">${video.title}</a></li>`).join('')}
                    </ul>
                </div>
                <div style="width: 48%; min-width: 250px;">
                    <h5>Most Popular Videos:</h5>
                    <ul>
                        ${audit.popularVideos.map(video => `<li><a href="https://www.youtube.com/watch?v=${video.videoId}" target="_blank">${video.title}</a></li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    // Video Details Explorer
    const videoDetailsBtn = document.getElementById('video-details-btn');
    const videoIdInput = document.getElementById('video-id-input');
    const videoDetailsResults = document.getElementById('video-details-results');

    videoDetailsBtn.addEventListener('click', () => {
        const videoId = videoIdInput.value.trim();
        if (videoId) {
            showLoader();
            videoDetailsResults.innerHTML = '';
            fetch('/api/video_details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            })
            .finally(() => hideLoader());
        }
    });

    function displayVideoDetails(element, details) {
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
            showLoader();
            keywordResults.innerHTML = '';
            fetch('/api/keyword_research', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keyword: keyword })
            })
            .then(response => response.json())
            .then(data => {
                displayResults(keywordResults, data);
            })
            .catch(error => {
                console.error('Error:', error);
                displayError(keywordResults, 'An error occurred.');
            })
            .finally(() => hideLoader());
        }
    });

    // AI Title Generator
    const titleBtn = document.getElementById('title-btn');
    const titleTopicInput = document.getElementById('title-topic-input');
    const titleResults = document.getElementById('title-results');

    titleBtn.addEventListener('click', () => {
        const topic = titleTopicInput.value.trim();
        if (topic) {
            showLoader();
            titleResults.innerHTML = '';
            fetch('/api/title_generator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: topic })
            })
            .then(response => response.json())
            .then(data => {
                displayResults(titleResults, data);
            })
            .catch(error => {
                console.error('Error:', error);
                displayError(titleResults, 'An error occurred.');
            })
            .finally(() => hideLoader());
        }
    });

    // Video Idea Generator
    const ideaBtn = document.getElementById('idea-btn');
    const ideaTopicInput = document.getElementById('idea-topic-input');
    const ideaResults = document.getElementById('idea-results');

    ideaBtn.addEventListener('click', () => {
        const topic = ideaTopicInput.value.trim();
        if (topic) {
            showLoader();
            ideaResults.innerHTML = '';
            fetch('/api/idea_generator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: topic })
            })
            .then(response => response.json())
            .then(data => {
                displayResults(ideaResults, data);
            })
            .catch(error => {
                console.error('Error:', error);
                displayError(ideaResults, 'An error occurred.');
            })
            .finally(() => hideLoader());
        }
    });

    // Hashtag Generator
    const hashtagBtn = document.getElementById('hashtag-btn');
    const hashtagInput = document.getElementById('hashtag-input');
    const hashtagResults = document.getElementById('hashtag-results');

    hashtagBtn.addEventListener('click', () => {
        const text = hashtagInput.value.trim();
        if (text) {
            showLoader();
            hashtagResults.innerHTML = '';
            fetch('/api/hashtag_generator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            })
            .finally(() => hideLoader());
        }
    });

    // AI Description & Tag Recommendations
    const descTagsBtn = document.getElementById('desc-tags-btn');
    const descTagsTopicInput = document.getElementById('desc-tags-topic-input');
    const descTagsResults = document.getElementById('desc-tags-results');

    descTagsBtn.addEventListener('click', () => {
        const topic = descTagsTopicInput.value.trim();
        if (topic) {
            showLoader();
            descTagsResults.innerHTML = '';
            fetch('/api/ai_description_tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            })
            .finally(() => hideLoader());
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

    // Bulk SEO Editor
    const fetchVideosBtn = document.getElementById('fetch-videos-btn');
    if (fetchVideosBtn) {
        const bulkEditorResults = document.getElementById('bulk-editor-results');
        const saveBulkEditBtn = document.getElementById('save-bulk-edit-btn');

        fetchVideosBtn.addEventListener('click', () => {
            showLoader();
            bulkEditorResults.innerHTML = '';
            fetchVideosBtn.textContent = 'Loading...';
            fetchVideosBtn.disabled = true;
            fetch('/api/my_videos')
                .then(response => response.json())
                .then(data => {
                    fetchVideosBtn.textContent = 'Fetch My Videos';
                    fetchVideosBtn.disabled = false;
                    if (data.error) {
                        displayError(bulkEditorResults, data.error);
                    } else {
                        renderBulkEditor(bulkEditorResults, data);
                        saveBulkEditBtn.style.display = 'block';
                    }
                })
                .finally(() => hideLoader());
        });

        const renderBulkEditor = (element, videos) => {
            element.innerHTML = '';
            const table = document.createElement('table');
            table.style.width = '100%';
            table.setAttribute('border', '1');
            table.setAttribute('cellpadding', '5');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th style="width: 30%;">Title</th>
                        <th style="width: 70%;">Description</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            `;
            const tbody = table.querySelector('tbody');
            videos.forEach((video) => {
                const row = document.createElement('tr');
                row.dataset.videoId = video.videoId;
                row.innerHTML = `
                    <td><input type="text" value="${video.title}" class="bulk-edit-title" style="width: 100%; box-sizing: border-box;"></td>
                    <td><textarea rows="4" class="bulk-edit-desc" style="width: 100%; box-sizing: border-box; resize: vertical;">${video.description}</textarea></td>
                `;
                tbody.appendChild(row);
            });
            element.appendChild(table);
        };

        saveBulkEditBtn.addEventListener('click', () => {
            const updatedVideos = [];
            document.querySelectorAll('#bulk-editor-results tbody tr').forEach(row => {
                const videoId = row.dataset.videoId;
                const title = row.querySelector('.bulk-edit-title').value;
                const description = row.querySelector('.bulk-edit-desc').value;
                updatedVideos.push({ videoId, title, description });
            });

            showLoader();
            saveBulkEditBtn.textContent = 'Saving...';
            saveBulkEditBtn.disabled = true;

            fetch('/api/bulk_edit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videos: updatedVideos })
            })
            .then(response => response.json())
            .then(data => {
                saveBulkEditBtn.textContent = 'Save All Changes';
                saveBulkEditBtn.disabled = false;
                alert(data.message || data.error);
            })
            .finally(() => hideLoader());
        });
    }

    // Subscriber Analysis
    const subscriberAnalysisBtn = document.getElementById('subscriber-analysis-btn');
    if (subscriberAnalysisBtn) {
        const subscriberAnalysisResults = document.getElementById('subscriber-analysis-results');

        subscriberAnalysisBtn.addEventListener('click', () => {
            showLoader();
            subscriberAnalysisResults.innerHTML = '';
            fetch('/api/subscriber_analysis')
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        displayError(subscriberAnalysisResults, data.error);
                    } else {
                        displaySubscriberAnalysis(subscriberAnalysisResults, data);
                    }
                })
                .finally(() => hideLoader());
        });

        const displaySubscriberAnalysis = (element, analysis) => {
            element.innerHTML = '';
            if (analysis.length === 0) {
                element.innerHTML = '<p>No subscriber data found for the last 30 days.</p>';
                return;
            }
            const list = document.createElement('ul');
            list.style.listStyle = 'none';
            list.style.padding = '0';
            analysis.forEach(item => {
                const listItem = document.createElement('li');
                listItem.style.marginBottom = '0.5rem';
                listItem.style.padding = '0.5rem';
                listItem.style.background = '#fdfdfd';
                listItem.style.borderRadius = '5px';
                listItem.innerHTML = `
                    <a href="https://www.youtube.com/watch?v=${item.videoId}" target="_blank">${item.title}</a>
                    <span style="float: right;"><strong>+${item.subscribersGained.toLocaleString()}</strong> subscribers</span>
                `;
                list.appendChild(listItem);
            });
            element.appendChild(list);
        };
    }

    // Comment Templates
    const commentTemplateForm = document.getElementById('comment-template-form');
    if (commentTemplateForm) {
        const addTemplateBtn = document.getElementById('add-template-btn');
        const templateTitleInput = document.getElementById('template-title-input');
        const templateTextInput = document.getElementById('template-text-input');
        const commentTemplateList = document.getElementById('comment-template-list');

        const fetchTemplates = () => {
            showLoader();
            commentTemplateList.innerHTML = '';
            fetch('/api/comment_templates')
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        displayError(commentTemplateList, data.error);
                    } else {
                        displayTemplates(commentTemplateList, data);
                    }
                })
                .finally(() => hideLoader());
        };

        const displayTemplates = (element, templates) => {
            element.innerHTML = '';
            if (templates.length === 0) {
                element.innerHTML = '<p>You have not created any comment templates yet.</p>';
                return;
            }
            const list = document.createElement('div');
            templates.forEach(t => {
                const item = document.createElement('div');
                item.style.border = '1px solid #ddd';
                item.style.padding = '1rem';
                item.style.marginBottom = '1rem';
                item.style.borderRadius = '5px';
                item.style.background = '#fdfdfd';
                item.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong>${t.title}</strong>
                        <div>
                            <button class="copy-template-btn" data-text="${t.text}" style="width: auto; display: inline-block; margin-top: 0; margin-left: 0.5rem;">Copy</button>
                            <button class="delete-template-btn" data-id="${t.id}" style="background-color: #dc3545; width: auto; display: inline-block; margin-top: 0; margin-left: 0.5rem;">Remove</button>
                        </div>
                    </div>
                    <p style="white-space: pre-wrap; margin-top: 0.5rem;">${t.text}</p>
                `;
                list.appendChild(item);
            });
            element.appendChild(list);
        };

        addTemplateBtn.addEventListener('click', () => {
            const title = templateTitleInput.value.trim();
            const text = templateTextInput.value.trim();
            if (title && text) {
                showLoader();
                fetch('/api/comment_templates', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: title, text: text })
                }).then(() => {
                    templateTitleInput.value = '';
                    templateTextInput.value = '';
                    fetchTemplates();
                })
                .finally(() => hideLoader());
            }
        });

        commentTemplateList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-template-btn')) {
                const templateId = e.target.dataset.id;
                showLoader();
                fetch(`/api/comment_templates/${templateId}`, { method: 'DELETE' })
                    .then(() => fetchTemplates())
                    .finally(() => hideLoader());
            }
            if (e.target.classList.contains('copy-template-btn')) {
                const textToCopy = e.target.dataset.text;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    e.target.textContent = 'Copied!';
                    setTimeout(() => { e.target.textContent = 'Copy'; }, 2000);
                });
            }
        });

        fetchTemplates(); // Fetch templates on page load
    }

    // Competitor Tracking
    const competitorForm = document.getElementById('competitor-form');
    if (competitorForm) {
        const addCompetitorBtn = document.getElementById('add-competitor-btn');
        const competitorChannelIdInput = document.getElementById('competitor-channel-id-input');
        const competitorList = document.getElementById('competitor-list');

        const fetchCompetitors = () => {
            showLoader();
            competitorList.innerHTML = '';
            fetch('/api/competitors')
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        displayError(competitorList, data.error);
                    } else {
                        displayCompetitors(competitorList, data);
                    }
                })
                .finally(() => hideLoader());
        };

        const displayCompetitors = (element, competitors) => {
            element.innerHTML = '';
            if (competitors.length === 0) {
                element.innerHTML = '<p>You have not added any competitors yet.</p>';
                return;
            }
            const list = document.createElement('ul');
            list.style.listStyle = 'none';
            list.style.padding = '0';
            competitors.forEach(c => {
                const item = document.createElement('li');
                item.style.marginBottom = '0.5rem';
                item.style.padding = '0.5rem';
                item.style.background = '#fdfdfd';
                item.style.borderRadius = '5px';
                item.innerHTML = `<span>${c.channel_id}</span> <button class="delete-competitor-btn" data-id="${c.id}" style="float: right; background-color: #dc3545; width: auto; display: inline-block; margin-top: -5px; color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 3px; cursor: pointer;">Remove</button>`;
                list.appendChild(item);
            });
            element.appendChild(list);
        };

        addCompetitorBtn.addEventListener('click', () => {
            const channelId = competitorChannelIdInput.value.trim();
            if (channelId) {
                showLoader();
                fetch('/api/competitors', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ channel_id: channelId })
                }).then(() => {
                    competitorChannelIdInput.value = '';
                    fetchCompetitors();
                })
                .finally(() => hideLoader());
            }
        });

        competitorList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-competitor-btn')) {
                const competitorId = e.target.dataset.id;
                showLoader();
                fetch(`/api/competitors/${competitorId}`, { method: 'DELETE' })
                    .then(() => fetchCompetitors())
                    .finally(() => hideLoader());
            }
        });

        fetchCompetitors(); // Fetch competitors on page load
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
