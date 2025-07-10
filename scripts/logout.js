// Wait for the DOM to be fully loaded before running the script
// This ensures all elements are available for manipulation

document.addEventListener('DOMContentLoaded', function() {
    const logoutLink = document.getElementById('logout'); // The logout link/button
    
    // Add a click event listener to the logout link
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent the default link behavior (no page reload)
        
        // Send a request to the server to log out the user
        fetch('../phps/logout.php')
            .then(response => response.json()) 
            .then(data => {
                console.log('Response:', data);  // Log the server response
                if (data.success) {
                    // If logout is successful, redirect to the provided URL
                    window.location.href = data.redirect;
                    console.log('Logout successful:', data.message);
                } else {
                    // If logout fails, log the error
                    console.error('Logout failed:', data.error);
                }
            })
            .catch(error => {
                // Handle network or server errors
                console.error('Error:', error);
            });
    });
});