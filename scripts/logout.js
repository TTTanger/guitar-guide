/**
 * Handles user logout functionality.
 * Sends a request to the server to log out the user and redirects on success.
 * @author Junzhe Luo
 */
document.addEventListener('DOMContentLoaded', function() {
    const logoutLink = document.getElementById('logout'); 

    /**
     * Handles the click event for the logout link.
     * Prevents default navigation, sends logout request, and redirects on success.
     * @param {Event} e The click event
     */
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault(); 
        fetch('../phps/logout.php')
            .then(response => response.json()) 
            .then(data => {
                if (data.success) {
                    window.location.href = data.redirect;
                } else {
                    console.error('Logout failed:', data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});