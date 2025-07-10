document.addEventListener('DOMContentLoaded', function() {
    const isMobile = window.innerWidth <= 767;
    
    if (isMobile) {
        initializeMobileLayout();
    }
    
    window.addEventListener('resize', function() {
        const newIsMobile = window.innerWidth <= 767;
        if (newIsMobile !== isMobile) {
            location.reload();
        }
    });
});

function initializeMobileLayout() {
    createMobileMenuButton();
    createMobileSidebarButton();
    createMobileOverlay();
    addTouchGestures();
}

function createMobileMenuButton() {
    if (document.querySelector('.mobile-menu-toggle')) {
        return;
    }
    
    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-toggle';
    menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    menuButton.setAttribute('aria-label', 'Toggle Navigation Menu');
    
    menuButton.addEventListener('click', function() {
        toggleNavigation();
    });
    
    document.body.appendChild(menuButton);
}

function createMobileSidebarButton() {
    if (document.querySelector('.mobile-sidebar-toggle')) {
        return;
    }
    
    const sidebarButton = document.createElement('button');
    sidebarButton.className = 'mobile-sidebar-toggle';
    sidebarButton.innerHTML = '<i class="fas fa-cog"></i>';
    sidebarButton.setAttribute('aria-label', 'Toggle Sidebar');
    
    sidebarButton.addEventListener('click', function() {
        toggleSidebar();
    });
    
    document.body.appendChild(sidebarButton);
}

function createMobileOverlay() {
    if (document.querySelector('.mobile-overlay')) {
        return;
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    
    overlay.addEventListener('click', function() {
        hideAllPanels();
    });
    
    document.body.appendChild(overlay);
}

function toggleNavigation() {
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

function hideAllPanels() {
    const nav = document.querySelector('nav');
    const sidebar = document.querySelector('aside');
    const overlay = document.querySelector('.mobile-overlay');
    
    nav.classList.remove('show');
    sidebar.classList.remove('show');
    overlay.classList.remove('show');
}

function addTouchGestures() {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
    });
    
    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
        
        e.preventDefault();
    });
    
    document.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            const nav = document.querySelector('nav');
            const sidebar = document.querySelector('aside');
            
            if (deltaX > 0 && startX < 50) {
                nav.classList.add('show');
                sidebar.classList.remove('show');
                document.querySelector('.mobile-overlay').classList.add('show');
            } else if (deltaX < 0 && startX > window.innerWidth - 50) {
                sidebar.classList.add('show');
                nav.classList.remove('show');
                document.querySelector('.mobile-overlay').classList.add('show');
            } else if (Math.abs(deltaX) > 100) {
                hideAllPanels();
            }
        }
        
        isDragging = false;
    });
}

document.addEventListener('keydown', function(e) {
    if (window.innerWidth > 767) return;
    
    switch(e.key) {
        case 'Escape':
            hideAllPanels();
            break;
        case 'm':
        case 'M':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                toggleNavigation();
            }
            break;
        case 's':
        case 'S':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                toggleSidebar();
            }
            break;
    }
});

function optimizeMobilePerformance() {
    const nav = document.querySelector('nav');
    const sidebar = document.querySelector('aside');
    
    if (nav) {
        nav.style.willChange = 'transform';
    }
    
    if (sidebar) {
        sidebar.style.willChange = 'transform';
    }
    
    const overlay = document.querySelector('.mobile-overlay');
    if (overlay) {
        overlay.style.transform = 'translateZ(0)';
    }
}

window.addEventListener('load', function() {
    if (window.innerWidth <= 767) {
        optimizeMobilePerformance();
    }
});

window.addEventListener('orientationchange', function() {
    setTimeout(function() {
        hideAllPanels();
    }, 100);
});

window.mobileUtils = {
    toggleNavigation: toggleNavigation,
    toggleSidebar: toggleSidebar,
    hideAllPanels: hideAllPanels
}; 