# Guitar Guide - Interactive Learning Platform

A comprehensive web-based guitar learning platform that provides interactive tutorials, chord learning, quiz functionality, and user account management. Built with modern web technologies including HTML5, CSS3, JavaScript (ES6+), and PHP with MySQL backend.

## Table of Contents

1. [Project Architecture](#project-architecture)
2. [UI Design Inspiration](#ui-design-inspiration)
3. [AJAX Implementation](#ajax-implementation)
4. [Security & Encryption](#security--encryption)
5. [Responsive Design](#responsive-design)
6. [Font Size Management](#font-size-management)
7. [Internationalization](#internationalization)
8. [Slideshow Component](#slideshow-component)
9. [User Profile Management](#user-profile-management)
10. [Session Management](#session-management)
11. [Dynamic DOM Manipulation](#dynamic-dom-manipulation)
12. [Project Advantages](#project-advantages)

## Project Architecture

The project follows a modular architecture with clear separation of concerns:

### Frontend Structure
- **HTML Pages**: Located in `htmls/` directory with semantic markup
- **CSS Styles**: Modular CSS files in `styles/` with responsive design
- **JavaScript Modules**: ES6 modules in `scripts/` for functionality
- **Assets**: Images and uploads organized in dedicated directories

### Backend Structure
- **PHP APIs**: RESTful endpoints in `phps/` directory
- **Database**: MySQL with prepared statements for security
- **Configuration**: JSON files for static data and translations

### Key Technical Implementation

```javascript
// Modular JavaScript architecture with ES6 imports
import { encrypt } from './encrypt.js';
import { getFormattedTime } from './utils.js';

// Class-based controllers for maintainable code
class FontSizeController {
    constructor() {
        this.defaultSize = 16;
        this.currentSize = this.defaultSize;
        this.minSize = 12;
        this.maxSize = 24;
        this.step = 2;
    }
    
    increase() {
        if (this.currentSize < this.maxSize) {
            this.currentSize += this.step;
            this.updateFontSize();
        }
    }
}
```

## UI Design Inspiration

The UI design draws inspiration from modern educational platforms and music learning websites:

### Design References
- **Duolingo**: Clean, card-based layout with progress indicators
- **Fender Play**: Guitar-specific learning interface with visual chord diagrams
- **Spotify**: Dark theme with orange accent colors for music-related content
- **GitHub**: Professional navigation and user profile management

### Design System
- **Color Palette**: Dark theme (#35424a) with orange accent (#e8491d)
- **Typography**: Open Sans font family for readability
- **Layout**: Fixed header with sidebar navigation and content area
- **Components**: Card-based content with consistent spacing and shadows

## AJAX Implementation

AJAX is extensively used throughout the application for seamless user experience:

### Authentication AJAX
```javascript
// Session verification on page load
fetch('../phps/auth.php')
    .then(response => response.json())
    .then(data => {
        if (!data.loggedin) {
            window.location.href = 'login.html';
        } else {
            document.getElementById('user-info').textContent = data.username;
            document.getElementById('user-avatar').src = data.user_avatar;
        }
    });
```

### Profile Management AJAX
```javascript
// Avatar upload with FormData
const formData = new FormData();
formData.append('action', 'postAvatar');
formData.append('avatar', file);

fetch('../phps/profile.php', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        user_avatar.src = data.user_avatar;
        profileAvatar.src = data.user_avatar;
    }
});
```

### Quiz Dynamic Loading
```javascript
// Dynamic question generation and rendering
function renderQuestion(quizContainer, questionObj, questionIndex, totalQuestions) {
    quizContainer.innerHTML = '';
    // Dynamically create question elements
    const qText = document.createElement('div');
    qText.setAttribute('data-translate', 'quiz.notesQuestion');
    // ... more dynamic element creation
}
```

### AJAX Principles
- **Asynchronous Communication**: Non-blocking requests for better UX
- **JSON Data Exchange**: Structured data format for API responses
- **Error Handling**: Comprehensive error catching and user feedback
- **Loading States**: Visual feedback during request processing

## Security & Encryption

The application implements a custom encryption system using time-based dynamic keys:

### Encryption Algorithm
```javascript
// Vigenère cipher variant with time-based key
export function encrypt(data, time) {
    const key = md5(time).slice(0);
    const dataLen = data.length;
    const keyLen = key.length;
    let encrypted = '';

    for (let i = 0; i < dataLen; i++) {
        const pChar = data[i];
        const kChar = key[i % keyLen];
        
        const pOffset = pChar.charCodeAt(0) - 32;
        const kOffset = kChar.charCodeAt(0) - 32;
        
        const cOffset = (pOffset + kOffset) % 95;
        encrypted += String.fromCharCode(cOffset + 32);
    }
    return encrypted;
}
```

### Decryption Implementation
```php
// PHP decryption with matching algorithm
function decrypt($encrypted, $time) {
    $key = md5($time);
    $encrypted_len = strlen($encrypted);
    $key_len = strlen($key);
    $decrypted = '';

    for ($i = 0; $i < $encrypted_len; $i++) {
        $c_char = $encrypted[$i];
        $k_char = $key[$i % $key_len];
        
        $c_offset = ord($c_char) - 32;
        $k_offset = ord($k_char) - 32;
        
        $p_offset = ($c_offset - $k_offset + 95) % 95;
        $decrypted .= chr($p_offset + 32);
    }
    return $decrypted;
}
```

### Security Features
- **Time-based Keys**: Each request uses a unique timestamp as encryption key
- **MD5 Hashing**: Key generation using MD5 for consistency
- **Printable ASCII Range**: Encryption limited to safe character range
- **Session Management**: Secure session handling with PHP sessions

## Responsive Design

The application implements a comprehensive mobile-responsive design:

### Mobile Layout Implementation
```javascript
// Mobile detection and layout switching
function initMobileLayout() {
    createMobileButtons();
    createOverlay();
    addEventListeners();
}

// Dynamic mobile navigation
function createMobileButtons() {
    const header = document.querySelector('header');
    
    const menuBtn = document.createElement('button');
    menuBtn.className = 'mobile-menu-toggle';
    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    header.appendChild(menuBtn);
}
```

### CSS Media Queries
```css
@media (max-width: 767px) {
    header {
        height: 60px;
        padding: 10px 0;
    }
    
    nav {
        position: fixed;
        top: 80px;
        left: -200px;
        width: 200px;
        transition: left 0.3s ease;
    }
    
    nav.show {
        left: 0;
    }
    
    main {
        margin-left: 20px;
        margin-right: 20px;
        margin-top: 80px;
    }
}
```

### Mobile Features
- **Touch Gestures**: Swipe support for slideshow navigation
- **Overlay System**: Modal overlays for mobile navigation
- **Adaptive Layout**: Content reflow for different screen sizes
- **Touch-friendly Controls**: Larger touch targets for mobile interaction

## Font Size Management

Dynamic font size adjustment system with proportional scaling:

### Font Controller Implementation
```javascript
class FontSizeController {
    constructor() {
        this.defaultSize = 16;
        this.currentSize = this.defaultSize;
        this.minSize = 12;
        this.maxSize = 24;
        this.step = 2;
        this.scales = {
            h1: 2,    // 32px at default
            h2: 1.5,  // 24px at default
            h3: 1.25, // 20px at default
            label: 1.125, // 18px at default
            p: 1,     // 16px at default
            small: 0.875 // 14px at default
        };
    }

    updateFontSize() {
        document.body.style.fontSize = `${this.currentSize}px`;
        
        Object.entries(this.scales).forEach(([element, scale]) => {
            const elements = document.getElementsByTagName(element);
            const scaledSize = this.currentSize * scale;
            
            Array.from(elements).forEach(el => {
                el.style.fontSize = `${scaledSize}px`;
            });
        });
    }
}
```

### Accessibility Features
- **Proportional Scaling**: All elements scale proportionally
- **Size Limits**: Minimum and maximum size constraints
- **Persistent Settings**: Font size preferences saved in localStorage
- **Keyboard Support**: Arrow key navigation for font adjustment

## Internationalization

Multi-language support with hybrid translation system:

### Translation Architecture
```javascript
class LanguageController {
    constructor() {
        this.currentLang = 'en';
        this.localTranslations = {};
        this.dbTranslations = {};
        this.mergedTranslations = {};
    }

    async loadAllTranslations() {
        await this.loadLocalTranslations();
        await this.loadDbTranslations();
        const mergedTranslations = {};
        const allLangs = new Set([
            ...Object.keys(this.localTranslations), 
            ...Object.keys(this.dbTranslations)
        ]);
        allLangs.forEach(lang => {
            mergedTranslations[lang] = deepMerge(
                { ...(this.localTranslations[lang] || {}) },
                this.dbTranslations[lang] || {}
            );
        });
        this.mergedTranslations = mergedTranslations;
    }
}
```

### Translation Sources
- **Static Content**: Stored in `configs/lang.json` for page-specific content
- **Dynamic Content**: Database-stored translations for reusable components
- **Component Reuse**: Navigation, buttons, and common elements from database
- **Content Separation**: Page-specific content in JSON files

### Database Translation Structure
```php
// PHP translation loading
$sql = "SELECT key_name, lang, value FROM translations";
$stmt = $conn->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();

$translations = [];
while ($row = $result->fetch_assoc()) {
    $lang = $row['lang'];
    $key = $row['key_name'];
    $value = $row['value'];
    setNestedValue($translations[$lang], $key, $value);
}
```

## Slideshow Component

Interactive slideshow with multiple navigation methods:

### Slideshow Implementation
```javascript
class Slideshow {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.autoPlayInterval = null;
        this.autoPlayDelay = 4000;
        
        this.init();
    }
    
    showSlide(index) {
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.indicators.forEach(indicator => indicator.classList.remove('active'));
        
        this.currentSlide = index;
        this.slides[index].classList.add('active');
        this.indicators[index].classList.add('active');
        
        this.resetAutoPlay();
    }
    
    initTouchSupport() {
        let startX = 0;
        let endX = 0;
        
        slideshowContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        slideshowContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });
    }
}
```

### Features
- **Auto-play**: Automatic slide progression with configurable timing
- **Touch Support**: Swipe gestures for mobile navigation
- **Keyboard Navigation**: Arrow key support for accessibility
- **Indicator Dots**: Visual progress indicators
- **Pause on Hover**: Auto-play pauses when user hovers over slideshow

## User Profile Management

Comprehensive user account management with file upload capabilities:

### Avatar Upload System
```javascript
// File upload with drag-and-drop support
uploadAvatarButton.addEventListener('click', () => {
    const file = avatarInput.files[0];
    if (!file) {
        alert('Please select a file first');
        return;
    }

    const formData = new FormData();
    formData.append('action', 'postAvatar');
    formData.append('avatar', file);

    fetch('../phps/profile.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            user_avatar.src = data.user_avatar;
            profileAvatar.src = data.user_avatar;
        }
    });
});
```

### Backend File Handling
```php
function postAvatar($id, $conn) {
    $file = $_FILES['avatar'];
    $file_ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    // Security validation
    $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
    if (!in_array($file_ext, $allowedTypes)) {
        echo json_encode(['success' => false, 'error' => 'Invalid file type']);
        return;
    }

    // Random filename generation
    $new_file_name = uniqid() . '.' . $file_ext;
    $upload_path = '../uploads/avatars/' . $new_file_name;

    if (move_uploaded_file($file['tmp_name'], $upload_path)) {
        $sql = "UPDATE accounts SET user_avatar = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $upload_path, $id);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'user_avatar' => $upload_path
            ]);
        }
    }
}
```

### Security Features
- **File Type Validation**: Only image formats allowed
- **Random Filenames**: Prevents filename conflicts and security issues
- **Database Integration**: File paths stored in database
- **Drag-and-Drop Support**: Enhanced user experience

## Session Management

Robust session handling with authentication verification:

### Session Verification
```php
// auth.php - Session status checking
session_start();
require_once "mysql.php";

$response = array(
    'loggedin' => isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true,
    'username' => isset($_SESSION['username']) ? $_SESSION['username'] : null,
);

if ($response['loggedin'] && isset($_SESSION['id'])) {
    $sql = "SELECT user_avatar FROM accounts WHERE id = ?";
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("i", $_SESSION['id']); 
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            if ($row = $result->fetch_assoc()) {
                $response['user_avatar'] = $row['user_avatar'] ?? '../images/default_avatar.jpeg';
            }
        }
        $stmt->close();
    }
}

echo json_encode($response);
```

### Frontend Session Handling
```javascript
// Automatic session verification on page load
document.addEventListener('DOMContentLoaded', function() {
    fetch('../phps/auth.php')
        .then(response => response.json())
        .then(data => {
            if (!data.loggedin) {
                window.location.href = 'login.html';
            } else {
                const userInfo = document.getElementById('user-info');
                const userAvatar = document.getElementById('user-avatar');
                if (userInfo) {
                    userInfo.textContent = data.username;
                }
                if (userAvatar && data.user_avatar) {
                    userAvatar.src = data.user_avatar;
                }
            }
        })
        .catch(error => {
            console.error('Auth check failed:', error);
            window.location.href = 'login.html';
        });
});
```

### Security Measures
- **Session Validation**: Every page verifies session status
- **Automatic Redirects**: Unauthorized users redirected to login
- **Database Integration**: User data fetched from database
- **Error Handling**: Graceful handling of session failures

## Dynamic DOM Manipulation

Advanced DOM manipulation for interactive content:

### Chord Learning System
```javascript
function createChordCard(chord) {
    const card = document.createElement('div');
    card.className = 'chord-card';

    const h3 = document.createElement('h3');
    h3.textContent = chord.name;
    card.appendChild(h3);

    const imagesDiv = document.createElement('div');
    imagesDiv.className = 'img-container';
    imagesDiv.id = 'img-container-chord';

    const noteImg = document.createElement('img');
    noteImg.src = chord.noteImage;
    noteImg.alt = `${chord.name} note diagram`;
    noteImg.id = 'img-note';
    imagesDiv.appendChild(noteImg);

    const chordImg = document.createElement('img');
    chordImg.src = chord.chordImage;
    chordImg.alt = `${chord.name} chord diagram`;
    chordImg.id = 'img-chord';
    imagesDiv.appendChild(chordImg);

    card.appendChild(imagesDiv);

    const desc = document.createElement('p');
    desc.setAttribute('data-translate', `chords.${chord.name}`);
    card.appendChild(desc);

    return card;
}
```

### Quiz Dynamic Generation
```javascript
function renderQuestion(quizContainer, questionObj, questionIndex, totalQuestions) {
    quizContainer.innerHTML = '';

    const qText = document.createElement('div');
    quizContainer.appendChild(qText);

    const chordName = document.createElement('h2');
    chordName.textContent = questionObj.correctChord;
    quizContainer.appendChild(chordName);
    
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';

    if (questionObj.type === 'note') {
        qText.setAttribute('data-translate', 'quiz.notesQuestion');
        questionObj.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.textContent = opt;
            btn.className = 'option-btn';
            btn.onclick = function () {
                handleAnswer(optionsContainer, questionObj, idx);
            };
            optionsContainer.appendChild(btn);
        });
    }
    
    quizContainer.appendChild(optionsContainer);
}
```

### Features
- **Dynamic Content Creation**: Elements created programmatically
- **Event Binding**: Interactive elements with event listeners
- **Translation Integration**: Dynamic content supports i18n
- **Responsive Design**: Elements adapt to different screen sizes

## Project Advantages

### Technical Excellence
- **Modern Architecture**: ES6+ JavaScript with modular design
- **Security First**: Custom encryption with time-based keys
- **Performance Optimized**: Efficient DOM manipulation and AJAX
- **Scalable Design**: Modular code structure for easy maintenance

### User Experience
- **Responsive Design**: Seamless experience across all devices
- **Accessibility**: Keyboard navigation and screen reader support
- **Internationalization**: Multi-language support with hybrid system
- **Interactive Learning**: Dynamic quiz system with visual feedback

### Educational Value
- **Visual Learning**: Chord diagrams and fingerboard illustrations
- **Progressive Difficulty**: Structured learning from basics to advanced
- **Practice Tools**: Interactive quiz system for knowledge reinforcement
- **Comprehensive Content**: Covers fundamental guitar concepts

### Development Quality
- **Clean Code**: Well-documented and maintainable codebase
- **Error Handling**: Comprehensive error management throughout
- **Cross-browser Compatibility**: Works across modern browsers
- **Mobile Optimization**: Touch-friendly interface for mobile devices

This project demonstrates advanced web development techniques while providing a valuable educational tool for guitar learners. The combination of modern technologies, security measures, and user-centered design creates a robust and engaging learning platform. 