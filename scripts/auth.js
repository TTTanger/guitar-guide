/**
 * Handles user authentication check on page load.
 * Redirects to login page if not authenticated, otherwise displays user info and avatar.
 * @author Junzhe Luo
 */
document.addEventListener('DOMContentLoaded', function() {
    /**
     * Checks user session by making a request to the backend auth.php.
     * Redirects to login page if not logged in, otherwise updates user info on the page.
     * @author Junzhe Luo
     */
    fetch('../phps/auth.php')
        .then(response => response.json())
        .then(data => {
            if (!data.loggedin) {
                window.location.href = 'login.html';
            } else {
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
            window.location.href = 'login.html';
        });
});