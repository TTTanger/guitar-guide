import { encryptPassword } from "./encrypt.js";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');
    const errorDiv = document.getElementById('error-message');

    loginForm.addEventListener('submit', async function(e) {
        // Prevent submitting the form automatically
        e.preventDefault(); 
        
        console.log('Form submitted');
        
        const formData = new FormData(this);
        const password = formData.get('password');
        const encryptedPassword = encryptPassword(password);
        formData.set('password', encryptedPassword);
        console.log('Encrypted password:', encryptedPassword);
        await sleep(1000); // Simulate delay
        
        try {
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData
            });
            console.log('Fetch response received'); 
            const data = await response.json();
            console.log('Processing data:', data); 
            if (data.success) {
                window.location.href = data.redirect;
            } else {
                errorDiv.textContent = data.error;
                errorDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Error:', error); 
            errorDiv.textContent = 'An error occurred. Please try again.';
            errorDiv.style.color = 'red';
        }
    });
});
