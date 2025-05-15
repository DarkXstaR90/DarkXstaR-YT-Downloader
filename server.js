document.addEventListener('DOMContentLoaded', () => {
    const videoUrlInput = document.getElementById('videoUrl');
    const fetchVideoBtn = document.getElementById('fetchVideo');
    const loader = document.getElementById('loader');
    const videoInfo = document.getElementById('videoInfo');
    const videoThumbnail = document.getElementById('videoThumbnail');
    const videoTitle = document.getElementById('videoTitle');
    const downloadOptions = document.getElementById('downloadOptions');
    const errorMessage = document.getElementById('errorMessage');

    // Function to fetch video details from backend
    async function fetchVideoDetails(url) {
        loader.style.display = 'flex';
        videoInfo.style.display = 'none';
        errorMessage.style.display = 'none';
        downloadOptions.innerHTML = ''; // Clear previous download options

        try {
            const response = await fetch('/api/video-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });

            const data = await response.json();
            loader.style.display = 'none';

            if (response.ok) {
                // Display video details
                videoThumbnail.src = data.thumbnail;
                videoTitle.textContent = data.title;
                videoInfo.style.display = 'block';

                // Dynamically add download buttons for available formats
                data.formats.forEach(format => {
                    const button = document.createElement('button');
                    button.classList.add('download-btn');
                    button.textContent = `Download ${format.quality} ${format.hasVideo ? '(Video)' : '(Audio)'}`;
                    button.addEventListener('click', () => {
                        window.open(format.url, '_blank'); // Open download URL in new tab
                    });
                    downloadOptions.appendChild(button);
                });
            } else {
                errorMessage.textContent = data.error || 'Error fetching video details.';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            loader.style.display = 'none';
            errorMessage.textContent = 'Failed to connect to server. Please try again.';
            errorMessage.style.display = 'block';
            console.error(error);
        }
    }

    // Event listener for "Get Video" button
    fetchVideoBtn.addEventListener('click', () => {
        const url = videoUrlInput.value.trim();
        if (url) {
            fetchVideoDetails(url);
        } else {
            errorMessage.textContent = 'Please enter a YouTube URL.';
            errorMessage.style.display = 'block';
        }
    });

    // Clear error message when user types in input
    videoUrlInput.addEventListener('input', () => {
        errorMessage.style.display = 'none';
    });
});
