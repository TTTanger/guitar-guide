document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the logout button
    const content = document.querySelector('.container');
    if (content) {
        content.style.display = 'none';
    }
    
    // Session Checking
    fetch('../phps/auth.php')
        .then(response => response.json())
        .then(data => {
            if (!data.loggedin) {
                window.location.href = 'login.html';
            } else {
                if (content) {
                    content.style.display = 'block';
                }
                // Show the User info
                const userInfo = document.getElementById('user-info');
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
            console.error('Auth check failed:', error);
            window.location.href = 'login.html';
        });
});