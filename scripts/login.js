import { encrypt } from "./encrypt.js";
import { getFormattedTime } from "./utils.js";

/**
 * Sleep function to simulate a delay.
 * Returns a Promise that resolves after the specified milliseconds.
 * Used here to mimic waiting (for example, to show a loading spinner or for testing).
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Wait for the HTML page (DOM) to be fully loaded before running the script
// This ensures all elements are available for selection and manipulation

document.addEventListener('DOMContentLoaded', function() {
    // Select the login form and the error message display area
    const loginForm = document.querySelector('form');
    const errorDiv = document.getElementById('error-message');

    // Add a submit event listener to the login form
    loginForm.addEventListener('submit', async function(e) {
        // Prevent the default form submission (which would reload the page)
        e.preventDefault();

        
        const time = getFormattedTime();

        // Collect all the data from the form fields
        const formData = new FormData(this);
        const password = formData.get('password');
        // Encrypt the password before sending it to the server
        // (see encrypt.js for the encryption algorithm)
        const encryptedPassword = encrypt(password, time);
        formData.set('password', encryptedPassword); 
        formData.set('time', time);

        const encryptedPswShow = document.createElement('p');
        encryptedPswShow.textContent = encryptedPassword;
        loginForm.appendChild(encryptedPswShow);

        // Simulate a delay (for user experience or testing)
        await sleep(3000); 
        
        try {
            // Send the form data to the server using the fetch API
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData
            });
            console.log('Fetch response received'); 
            // Parse the JSON response from the server
            const data = await response.json();
            console.log('Processing data:', data); 
            if (data.success) {
                // If login is successful, redirect the user to the provided URL
                window.location.href = data.redirect;
            } else {
                // If login fails, display the error message from the server
                errorDiv.textContent = data.error;
                errorDiv.classList.add('show');
            }
        } catch (error) {
            // Handle network or server errors
            console.error('Error:', error); 
            errorDiv.textContent = 'An error occurred. Please try again.';
            errorDiv.style.color = 'red';
        }
    });
});