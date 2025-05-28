import { encryptPassword } from "./encrypt.js";

document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.querySelector('form');
    const errorDiv = document.getElementById('error-message');

    registerForm.addEventListener('submit', function (e) {
        // Prevent submitting the form automatically
        e.preventDefault();

        console.log('Form submitted');

        const formData = new FormData(this);
        const password = formData.get('password');
        const encryptedPassword = encryptPassword(password);
        formData.set('password', encryptedPassword);
        console.log('Encrypted password:', encryptedPassword);
        

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
                    window.location.href = data.redirect;
                } else {
                    errorDiv.textContent = data.error;
                    errorDiv.style.color = 'red';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                errorDiv.textContent = 'An error occurred. Please try again.';
                errorDiv.style.color = 'red';
            });
    });
});