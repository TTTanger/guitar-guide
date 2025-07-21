import { encrypt } from "./encrypt.js";
import { getFormattedTime } from "./utils.js";

/**
 * Sleep function to simulate a delay.
 * Returns a Promise that resolves after the specified milliseconds.
 * Used to mimic waiting (e.g., to show a loading spinner or for testing).
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise}
 * @author Junzhe Luo
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Handles login form submission, encrypts password, sends data to server, and processes response.
 * @author Junzhe Luo
 */
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');
    const errorDiv = document.getElementById('error-message');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const time = getFormattedTime();
        const formData = new FormData(this);
        const password = formData.get('password');
        const encryptedPassword = encrypt(password, time);
        formData.set('password', encryptedPassword);
        formData.set('time', time);
        let encryptedPswShow = document.getElementById('encryptedPswShow');
        if (!encryptedPswShow) {
            encryptedPswShow = document.createElement('div');
            encryptedPswShow.id = 'encryptedPswShow';
            encryptedPswShow.textContent = encryptedPassword;
            loginForm.appendChild(encryptedPswShow);
        } else {
            encryptedPswShow.textContent = encryptedPassword;
        }
        await sleep(3000);
        try {
            const response = await fetch("../phps/login.php", {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                window.location.href = data.redirect;
            } else {
                errorDiv.textContent = data.error;
                errorDiv.classList.add('show');
            }
        } catch (error) {
            errorDiv.textContent = 'An error occurred. Please try again.';
            errorDiv.style.color = 'red';
        }
    });
});