document.addEventListener('DOMContentLoaded', () => {
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
