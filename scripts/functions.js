// Fontsize Controller
class FontSizeController {
    constructor() {
        this.defaultSize = 16; // Default font size in px
        this.currentSize = this.defaultSize;
        this.minSize = 12; // Minimum font size
        this.maxSize = 24; // Maximum font size
        this.step = 2;     // Step size for each increase/decrease
        // Scale factors for different elements
        this.scales = {
            h1: 2,    // 32px at default
            h2: 1.5,  // 24px at default
            h3: 1.25, // 20px at default
            label: 1.125, // 18px at default
            p: 1,     // 16px at default
            small: 0.875 // 14px at default
        };
    }

    /**
     * Increase font size (up to maxSize)
     * If the current size is less than the maximum, increase it by the step and update the font size on the page.
     */
    increase() {
        if (this.currentSize < this.maxSize) {
            this.currentSize += this.step;
            this.updateFontSize();
        }
    }

    /**
     * Decrease font size (down to minSize)
     * If the current size is greater than the minimum, decrease it by the step and update the font size on the page.
     */
    decrease() {
        if (this.currentSize > this.minSize) {
            this.currentSize -= this.step;
            this.updateFontSize();
        }
    }

    /**
     * Update the font size for the body and all scaled elements.
     * This method sets the font size for the body and for each element type defined in the scales object.
     */
    updateFontSize() {
        document.body.style.fontSize = `${this.currentSize}px`;
        
        Object.entries(this.scales).forEach(([element, scale]) => {
            const elements = document.getElementsByTagName(element);
            const scaledSize = this.currentSize * scale;
            
            Array.from(elements).forEach(el => {
                el.style.fontSize = `${scaledSize}px`;
            });
        });

        // Update elements with the 'small-text' class
        const smallTexts = document.querySelectorAll('.small-text');
        smallTexts.forEach(el => {
            el.style.fontSize = `${this.currentSize * this.scales.small}px`;
        });
    }

    /**
     * Reset font size to default.
     * Sets the current size back to the default and updates the font size on the page.
     */
    reset() {
        this.currentSize = this.defaultSize;
        this.updateFontSize();
    }
}

// Language Controller
class LanguageController {
    constructor() {
        this.currentLang = 'en'; // Default language
        this.translations = {};  // Loaded translations
        this.loadPromise = this.loadTranslations();
    }

    /**
     * Load translations from the config file (async)
     * Fetches the language JSON file and loads it into the translations object.
     * If a preferred language is saved in localStorage, it sets that language.
     */
    async loadTranslations() {
        try {
            const response = await fetch('../configs/lang.json');
            this.translations = await response.json();
            // Load saved language preference from localStorage
            const savedLang = localStorage.getItem('preferredLanguage');
            if (savedLang && this.translations[savedLang]) {
                this.setLanguage(savedLang);
            }
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    /**
     * Set the current language and update the page content.
     * Also saves the preference to localStorage.
     * @param {string} lang - The language code to set (e.g., 'en', 'zh', 'de')
     */
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            this.updateContent();
            localStorage.setItem('preferredLanguage', lang);
        }
    }

    /**
     * Update all elements with data-translate attribute using the current language.
     * Looks up the translation for each element and updates its text or placeholder.
     */
    updateContent() {
        const translation = this.translations[this.currentLang];
        if (!translation) return;

        document.querySelectorAll('[data-translate]').forEach(element => {
            const path = element.dataset.translate.split('.');
            let value = translation;

            // Traverse the translation object using the path
            for (const key of path) {
                if (value) value = value[key];
            }

            if (value) {
                // For input/textarea, set placeholder; otherwise, set textContent
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = value;
                } else {
                    element.textContent = value;
                }
            }
        });
    }

    /**
     * Get the current language code.
     * @returns {string} The current language code
     */
    getCurrentLanguage() {
        return this.currentLang;
    }
}

// Instantiate controllers and expose them globally for debugging or external use
const fontController = new FontSizeController();
const langController = new LanguageController();
window.langController = langController;
window.fontController = fontController;

// Event Listeners
// Wait for the DOM to be fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Query all control buttons for font size and language
    const fontIncreaseBtn = document.querySelector('#fontInc')
    const fontDecreaseBtn = document.querySelector('#fontDec')
    const cnBtn = document.querySelector('#cn')
    const enBtn = document.querySelector('#en')
    const deBtn = document.querySelector('#de')
    
    // Add event listeners for font size controls
    fontIncreaseBtn.addEventListener('click', () => fontController.increase());
    fontDecreaseBtn.addEventListener('click', () => fontController.decrease());
    // Add event listeners for language switching
    cnBtn.addEventListener('click', () => {
        langController.setLanguage('zh');
        console.log('Chinese button clicked');
    });

    enBtn.addEventListener('click', () => langController.setLanguage('en'));
    deBtn.addEventListener('click', () => langController.setLanguage('de'));

    // Load saved language preference if available
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && ['en', 'zh', 'de'].includes(savedLang)) {
        langController.setLanguage(savedLang);
    }
});