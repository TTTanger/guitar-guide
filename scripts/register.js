// Import the encryptPassword function from encrypt.js
import { encrypt } from "./encrypt.js";
import { getFormattedTime } from "./utils.js";

// Wait for the DOM to be fully loaded before running the script
// This ensures all elements are available for manipulation

document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.querySelector('form'); // The registration form element
    const errorDiv = document.getElementById('error-message'); // Error message display area
    
    // Add a submit event listener to the registration form
    registerForm.addEventListener('submit', function (e) {
        // Prevent submitting the form automatically (no page reload)
        e.preventDefault();

        console.log('Form submitted');

        const time = getFormattedTime();

        // Collect all the data from the form fields
        const formData = new FormData(this);
        const password = formData.get('password'); 

        // Encrypt the password before sending it to the server
        const encryptedPassword = encrypt(password, time);
        formData.set('password', encryptedPassword); 
        formData.set('time', time);
        console.log('Encrypted password:', encryptedPassword);
        
        // Send the registration data to the server using fetch API
        fetch(this.action, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                console.log('Fetch response received');
                return response.json();
            })
            .then(data => {
                console.log('Processing data:', data);
                if (data.success) {
                    // If registration is successful, redirect to the provided URL
                    window.location.href = data.redirect;
                } else {
                    // If registration fails, display the error message
                    errorDiv.textContent = data.error;
                    errorDiv.classList.add('show');
                }
            })
            .catch(error => {
                // Handle network or server errors
                console.error('Error:', error);
                errorDiv.textContent = 'An error occurred. Please try again.';
            });
    });
});
