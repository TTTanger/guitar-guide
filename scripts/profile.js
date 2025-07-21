import { getFormattedTime } from './utils.js';
import { encrypt } from './encrypt.js';

document.addEventListener('DOMContentLoaded', () => {
    const profileAvatar = document.querySelector('#profile-avatar img'); 
    const bestScore = document.getElementById('best-score'); 
    const username = document.querySelector('.profile-info h2');
    const user_avatar = document.getElementById('user-avatar');
    const joinDate = document.getElementById('join-date');
    const uploadAvatarButton = document.getElementById('save-avatar');
    const avatarInput = document.getElementById('avatar-input'); 
    const currentPassword = document.getElementById('current-password'); 
    const newPassword = document.getElementById('new-password'); 
    const confirmPassword = document.getElementById('confirm-password'); 
    const uploadPasswordButton = document.getElementById('save-password'); 
    const uploadContainer = document.getElementById('upload-container'); 

    /**
     * Fetch and display the user profile information from the server
     */
    fetch('../phps/profile.php?action=getUserProfile')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                profileAvatar.src = data.user_avatar; 
                user_avatar.src = data.user_avatar;   
                bestScore.textContent = data.best_score; 
                username.textContent = data.username;     
                joinDate.textContent = data.join_date;    
            } else {
                console.error('Failed to load profile:', data.error);
            }
        })
        .catch(error => {
            console.error('Error loading profile:', error);
        });

    /**
     * Handle password update logic when the user clicks the update button
     */
    uploadPasswordButton.addEventListener('click', () => {
        if (!currentPassword.value || !newPassword.value) {
            alert('Please fill in both password fields');
            return;
        }
        if (newPassword.value.length < 6) {
            alert('New password must be at least 6 characters long');
            return;
        }
        const formData = new FormData();
        const time = getFormattedTime();
        formData.set('action', 'updatePassword');
        formData.set('time', time);
        const encryptedCurrentPsw = encrypt(currentPassword.value, time);
        const encryptedNewPsw = encrypt(newPassword.value, time);
        formData.set('current_password', encryptedCurrentPsw);
        formData.set('new_password', encryptedNewPsw);
        uploadPasswordButton.disabled = true;
        uploadPasswordButton.setAttribute('data-translate', 'profile.uploading');
        langController.updateContent();
        fetch('../phps/profile.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Password updated successfully');
                currentPassword.value = '';
                newPassword.value = '';
                confirmPassword.value = '';
            } else {
                alert('Failed to update password: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to update password. Please try again.');
        })
        .finally(() => {
            uploadPasswordButton.disabled = false;
            uploadPasswordButton.setAttribute('data-translate', 'profile.save');
            langController.updateContent();
        });
    });

    /**
     * Handle avatar upload logic when the user clicks the upload button
     */
    uploadAvatarButton.addEventListener('click', () => {
        const file = avatarInput.files[0];
        if (!file) {
            alert('Please select a file first');
            return;
        }
        const formData = new FormData();
        formData.append('action', 'postAvatar');
        formData.append('avatar', file);
        uploadAvatarButton.disabled = true;
        uploadAvatarButton.setAttribute('data-translate', 'profile.uploading');
        langController.updateContent();
        fetch('../phps/profile.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                user_avatar.src = data.user_avatar;
                profileAvatar.src = data.user_avatar;
            } else {
                alert('Failed to upload avatar: ' + data.error);
                fetch('../phps/profile.php?action=getUserProfile')
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            profileAvatar.src = data.user_avatar;
                        }
                    });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to upload avatar');
        })
        .finally(() => {
            uploadAvatarButton.disabled = false;
            uploadAvatarButton.setAttribute('data-translate', 'profile.save');
            langController.updateContent();
            avatarInput.value = '';
        });
    });

    /**
     * Allow clicking the upload container to trigger the file input
     */
    uploadContainer.addEventListener('click', () => {
        avatarInput.click();
    });

    /**
     * Show the selected file name when a file is chosen
     */
    avatarInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const fileName = e.target.files[0].name;
            const fileInfo = uploadContainer.querySelector('#upload-hint');
            if (fileInfo) {
                fileInfo.textContent = `Selected: ${fileName}`;
            }
        }
    });

    /**
     * Drag-and-drop avatar upload support: highlight the upload area on drag
     */
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadContainer.addEventListener(eventName, highlight, false);
    });

    /**
     * Drag-and-drop avatar upload support: remove highlight on drag leave or drop
     */
    ['dragleave', 'drop'].forEach(eventName => {
        uploadContainer.addEventListener(eventName, unhighlight, false);
    });

    /**
     * Handle file drop event for avatar upload
     * @param {Event} e The drop event
     */
    uploadContainer.addEventListener('drop', handleDrop, false);

    /**
     * Add a visual highlight to the upload area
     * @param {Event} e The drag event
     */
    function highlight(e) {
        uploadContainer.classList.add('dragover');
    }

    /**
     * Remove the visual highlight from the upload area
     * @param {Event} e The drag event
     */
    function unhighlight(e) {
        uploadContainer.classList.remove('dragover');
    }

    /**
     * Handle the file drop event for avatar upload
     * Sets the dropped file as the input's file and triggers the change event
     * @param {Event} e The drop event
     */
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length) {
            avatarInput.files = files;
            avatarInput.dispatchEvent(new Event('change'));
        }
    }
});