/*
 * Mobile adaptation script
 * Main features:
 * 1. Detects mobile devices and initializes mobile layout
 * 2. Dynamically creates mobile menu buttons, user info, and overlay
 * 3. Binds events for menu, sidebar, overlay, and handles mobile interactions
 * 4. Supports auto-closing overlays on orientation change
 * 5. Exposes utility methods for external use
 * 
 * @author Claude 3.5 Sonnet
 */
document.addEventListener('DOMContentLoaded', function() {
    const isMobile = window.innerWidth <= 767;
    if (isMobile) {
        initMobileLayout();
    }
    window.addEventListener('resize', function() {
        const newIsMobile = window.innerWidth <= 767;
        if (newIsMobile !== isMobile) {
            window.location.reload();
        }
    });
});

/**
 * Initialize mobile layout: create buttons, overlay, and bind events
 */
function initMobileLayout() {
    createMobileButtons();
    createOverlay();
    addEventListeners();
}

/**
 * Create mobile menu and sidebar buttons, and insert into header
 */
function createMobileButtons() {
    const header = document.querySelector('header');
    const menuBtn = document.createElement('button');
    menuBtn.className = 'mobile-menu-toggle';
    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    header.appendChild(menuBtn);
    const sidebarBtn = document.createElement('button');
    sidebarBtn.className = 'mobile-sidebar-toggle';
    sidebarBtn.innerHTML = '<i class="fas fa-cog"></i>';
    header.appendChild(sidebarBtn);
    createMobileUserProfile();
}

/**
 * Dynamically create mobile user info (avatar, username, logout button)
 * Only shown when user is logged in
 */
function createMobileUserProfile() {
    const nav = document.querySelector('nav');
    fetch('../phps/auth.php')
        .then(response => response.json())
        .then(data => {
            if (data.loggedin) {
                const userProfile = document.createElement('div');
                userProfile.className = 'mobile-user-profile';
                const mobileAvatar = document.createElement('img');
                mobileAvatar.className = 'mobile-user-avatar';
                mobileAvatar.src = data.user_avatar || '../images/default_avatar.jpeg';
                mobileAvatar.alt = 'User avatar';
                const mobileName = document.createElement('p');
                mobileName.className = 'mobile-user-name';
                mobileName.textContent = data.username;
                const profileLink = document.createElement('a');
                profileLink.href = 'profile.html';
                profileLink.style.textDecoration = 'none';
                profileLink.style.color = 'inherit';
                profileLink.appendChild(mobileAvatar);
                profileLink.appendChild(mobileName);
                const logoutBtn = document.createElement('a');
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault(); 
                    fetch('../phps/logout.php')
                        .then(response => response.json()) 
                        .then(data => {
                            if (data.success) {
                                window.location.href = data.redirect;
                            } else {
                                console.error('Logout failed:', data.error);
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                })
                logoutBtn.className = 'mobile-logout-btn';
                logoutBtn.textContent = 'Logout';
                userProfile.appendChild(profileLink);
                userProfile.appendChild(logoutBtn);
                nav.insertBefore(userProfile, nav.firstChild);
            }
        })
        .catch(error => {
            console.error('Failed to fetch user data:', error);
        });
}

/**
 * Create overlay for mobile menu/sidebar popups
 */
function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    document.body.appendChild(overlay);
}

/**
 * Bind events for menu, sidebar, overlay, and ESC key
 */
function addEventListeners() {
    const menuBtn = document.querySelector('.mobile-menu-toggle');
    menuBtn.addEventListener('click', toggleNav);
    menuBtn.title = 'Nav'
    const sidebarBtn = document.querySelector('.mobile-sidebar-toggle');
    sidebarBtn.title = 'Functions'
    sidebarBtn.addEventListener('click', toggleSidebar);
    const overlay = document.querySelector('.mobile-overlay');
    overlay.addEventListener('click', hideAll);
}

/**
 * Toggle navigation bar (mobile menu) visibility
 */
function toggleNav() {
    const nav = document.querySelector('nav');
    const overlay = document.querySelector('.mobile-overlay');
    const sidebar = document.querySelector('aside');
    if (nav.classList.contains('show')) {
        nav.classList.remove('show');
        overlay.classList.remove('show');
    } else {
        nav.classList.add('show');
        overlay.classList.add('show');
        sidebar.classList.remove('show');
    }
}

/**
 * Toggle sidebar visibility
 */
function toggleSidebar() {
    const sidebar = document.querySelector('aside');
    const overlay = document.querySelector('.mobile-overlay');
    const nav = document.querySelector('nav');
    if (sidebar.classList.contains('show')) {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
    } else {
        sidebar.classList.add('show');
        overlay.classList.add('show');
        nav.classList.remove('show');
    }
}

/**
 * Hide all popups (menu, sidebar, overlay)
 */
function hideAll() {
    const nav = document.querySelector('nav');
    const sidebar = document.querySelector('aside');
    const overlay = document.querySelector('.mobile-overlay');
    nav.classList.remove('show');
    sidebar.classList.remove('show');
    overlay.classList.remove('show');
}

// Listen for orientation change and auto-hide all popups
window.addEventListener('orientationchange', function() {
    setTimeout(hideAll, 100);
});

// Expose utility methods for external use
window.mobileUtils = {
    toggleNav: toggleNav,
    toggleSidebar: toggleSidebar,
    hideAll: hideAll
}; 