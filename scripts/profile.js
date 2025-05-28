document.addEventListener('DOMContentLoaded', () => {
    // Get all the elements
    const profileAvatar = document.querySelector('.profile-avatar img');
    const bestScore = document.getElementById('best-score');
    const username = document.querySelector('.profile-info h2')
    const user_avatar = document.getElementById('user-avatar')
    const joinDate = document.getElementById('join-date')
    const uploadAvatarButton = document.getElementById('save-avatar');
    const avatarInput = document.getElementById('avatar-input');
    const currentPassword = document.getElementById('current-password');
    const newPassword = document.getElementById('new-password');
    const confirmPassword = document.getElementById('confirm-password');
    const uploadPasswordButton = document.getElementById('save-password');
    const uploadContainer = document.getElementById('upload-container');

    /* Get the user profile */
    // Fetch the profile data from the server
    fetch('../phps/profile.php?action=getUserProfile')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data)
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

    uploadPasswordButton.addEventListener('click', () => {
        // Verify the input
        if (!currentPassword.value || !newPassword.value) {
            alert('Please fill in both password fields');
            return;
        }

        // Verify the length of password
        if (newPassword.value.length < 6) {
            alert('New password must be at least 6 characters long');
            return;
        }

        const formData = new FormData();
        formData.append('action', 'updatePassword');
        formData.append('current_password', currentPassword.value);
        formData.append('new_password', newPassword.value);


        uploadPasswordButton.disabled = true;
        uploadPasswordButton.textContent = 'Updating...';

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


    // Handle the file input change event
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
        uploadAvatarButton.textContent = 'Uploading...';

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
            uploadAvatarButton.textContent = 'Upload Avatar';
            avatarInput.value = '';
        });
    });

    // Add click handler for the container
    uploadContainer.addEventListener('click', () => {
        avatarInput.click();
    });

    // Handle file selection via input
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

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadContainer.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Handle dragenter and dragover
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadContainer.addEventListener(eventName, highlight, false);
    });

    // Handle dragleave and drop
    ['dragleave', 'drop'].forEach(eventName => {
        uploadContainer.addEventListener(eventName, unhighlight, false);
    });

    // Handle drop
    uploadContainer.addEventListener('drop', handleDrop, false);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        uploadContainer.classList.add('dragover');
    }

    function unhighlight(e) {
        uploadContainer.classList.remove('dragover');
    }

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