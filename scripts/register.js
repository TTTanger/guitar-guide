/**
 * Handles user registration form submission, encrypts password, sends data to server, and processes response.
 * @author Junzhe Luo
 */
// Import the encryptPassword function from encrypt.js
import { encrypt } from "./encrypt.js";
import { getFormattedTime } from "./utils.js";

document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.querySelector('form'); 
    const errorDiv = document.getElementById('error-message'); 

    /**
     * Handles the registration form submit event, encrypts password, and sends data to the server.
     * @author Junzhe Luo
     */
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
        
        fetch("../phps/register.php", {
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
                    window.location.href = data.redirect;
                } else {
                    errorDiv.textContent = data.error;
                    errorDiv.classList.add('show');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                errorDiv.textContent = 'An error occurred. Please try again.';
            });
    });
});
