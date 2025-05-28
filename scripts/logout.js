document.addEventListener('DOMContentLoaded', function() {
    const logoutLink = document.getElementById('logout-link');
    
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        
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