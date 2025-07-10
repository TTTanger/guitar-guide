// Wait for the DOM to be fully loaded before running the script
// This ensures all elements are available for manipulation

document.addEventListener('DOMContentLoaded', () => {
    // Get all the elements needed for the profile page
    const profileAvatar = document.querySelector('.profile-avatar img'); // Main profile avatar image
    const bestScore = document.getElementById('best-score'); // Best quiz score display
    const username = document.querySelector('.profile-info h2') // Username display
    const user_avatar = document.getElementById('user-avatar') // Avatar in the header or elsewhere
    const joinDate = document.getElementById('join-date') // Join date display
    const uploadAvatarButton = document.getElementById('save-avatar'); // Button to upload avatar
    const avatarInput = document.getElementById('avatar-input'); // File input for avatar
    const currentPassword = document.getElementById('current-password'); // Current password input
    const newPassword = document.getElementById('new-password'); // New password input
    const confirmPassword = document.getElementById('confirm-password'); // Confirm new password input
    const uploadPasswordButton = document.getElementById('save-password'); // Button to update password
    const uploadContainer = document.getElementById('upload-container'); // Container for avatar upload UI

    /*
     * Fetch and display the user profile information from the server
     */
    fetch('../phps/profile.php?action=getUserProfile')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data)
                profileAvatar.src = data.user_avatar; // Set profile avatar image
                user_avatar.src = data.user_avatar;   // Set header/avatar image
                bestScore.textContent = data.best_score; // Show best score
                username.textContent = data.username;     // Show username
                joinDate.textContent = data.join_date;    // Show join date
            } else {
                console.error('Failed to load profile:', data.error);
            }
        })
        .catch(error => {
            console.error('Error loading profile:', error);
        });

    /*
     * Handle password update logic when the user clicks the update button
     */
    uploadPasswordButton.addEventListener('click', () => {
        // Verify the input fields are filled
        if (!currentPassword.value || !newPassword.value) {
            alert('Please fill in both password fields');
            return;
        }

        // Verify the length of the new password
        if (newPassword.value.length < 6) {
            alert('New password must be at least 6 characters long');
            return;
        }

        // Prepare form data for the password update request
        const formData = new FormData();
        formData.append('action', 'updatePassword');
        formData.append('current_password', currentPassword.value);
        formData.append('new_password', newPassword.value);

        // Disable the button and show updating status
        uploadPasswordButton.disabled = true;
        uploadPasswordButton.textContent = 'Updating...';

        // Send the password update request to the server
        fetch('../phps/profile.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Password updated successfully');
                // Clear the input fields
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
            uploadPasswordButton.textContent = 'Update Password';
        });
    })

    /*
     * Handle avatar upload logic when the user clicks the upload button
     */
    uploadAvatarButton.addEventListener('click', () => {
        const file = avatarInput.files[0]; // Get the selected file
        if (!file) {
            alert('Please select a file first');
            return;
        }

        // Prepare form data for the avatar upload request
        const formData = new FormData();
        formData.append('action', 'postAvatar');
        formData.append('avatar', file);

        // Disable the button and show uploading status
        uploadAvatarButton.disabled = true;
        uploadAvatarButton.setAttribute('data-translate', 'profile.uploading');
        langController.updateContent();

        // Send the avatar upload request to the server
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
                // If upload fails, reload the current avatar from the server
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

    /*
     * Allow clicking the upload container to trigger the file input
     */
    uploadContainer.addEventListener('click', () => {
        avatarInput.click();
    });

    /*
     * Show the selected file name when a file is chosen
     */
    avatarInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            // Optional: Add visual feedback
            const fileName = e.target.files[0].name;
            const fileInfo = uploadContainer.querySelector('.file-upload-content p');
            if (fileInfo) {
                fileInfo.textContent = `Selected: ${fileName}`;
            }
        }
    });

    // Prevent click propagation on the actual input to avoid double triggers
    avatarInput.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    /*
     * Drag-and-drop avatar upload support
     * The following handlers allow users to drag a file onto the upload area
     */
    // Prevent default drag behaviors for both the upload container and the document body
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadContainer.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight the upload area when a file is dragged over
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadContainer.addEventListener(eventName, highlight, false);
    });

    // Remove highlight when the file is dragged away or dropped
    ['dragleave', 'drop'].forEach(eventName => {
        uploadContainer.addEventListener(eventName, unhighlight, false);
    });

    // Handle file drop event
    uploadContainer.addEventListener('drop', handleDrop, false);

    /**
     * Prevent default drag/drop behaviors and stop event propagation
     */
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    /**
     * Add a visual highlight to the upload area
     */
    function highlight(e) {
        uploadContainer.classList.add('dragover');
    }

    /**
     * Remove the visual highlight from the upload area
     */
    function unhighlight(e) {
        uploadContainer.classList.remove('dragover');
    }

    /**
     * Handle the file drop event for avatar upload
     * Sets the dropped file as the input's file and triggers the change event
     */
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length) {
            avatarInput.files = files;
            // Trigger change event
            avatarInput.dispatchEvent(new Event('change'));
        }
    }
});