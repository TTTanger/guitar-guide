// Wait for the DOM to be fully loaded before running the script
// This ensures all elements are available for manipulation
document.addEventListener('DOMContentLoaded', function() {
    /**
     * Check user session by making a request to the backend auth.php
     * This determines if the user is logged in or not.
     */
    fetch('../phps/auth.php')
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            // If not logged in, redirect to login page
            if (!data.loggedin) {
                window.location.href = 'login.html';
            } else {
                // Display the username in the user-info element
                const userInfo = document.getElementById('user-info');
                // Display the user's avatar if available
                const userAvatar = document.getElementById('user-avatar');
                if (userInfo) {
                    userInfo.textContent = data.username;
                }
                if (userAvatar && data.user_avatar) {
                    userAvatar.src = data.user_avatar;
                }
            }
        })
        .catch(error => {
            // If the authentication check fails (e.g., network error), redirect to login
            console.error('Auth check failed:', error);
            window.location.href = 'login.html';
        });
});