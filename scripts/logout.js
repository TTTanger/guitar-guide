// Wait for the DOM to be fully loaded before running the script
// This ensures all elements are available for manipulation

document.addEventListener('DOMContentLoaded', function() {
    const logoutLink = document.getElementById('logout'); 
    
    // Add a click event listener to the logout link
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault(); 
        
        // Send a request to the server to log out the user
        fetch('../phps/logout.php')
            .then(response => response.json()) 
            .then(data => {
                console.log('Response:', data);  
                if (data.success) {
                    window.location.href = data.redirect;
                    console.log('Logout successful:', data.message);
                } else {
                    console.error('Logout failed:', data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});