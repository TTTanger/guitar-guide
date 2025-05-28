// Fontsize Controller
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
            p: 1,     // 16px at default
            small: 0.875 // 14px at default
        };
    }

    increase() {
        if (this.currentSize < this.maxSize) {
            this.currentSize += this.step;
            this.updateFontSize();
        }
    }

    decrease() {
        if (this.currentSize > this.minSize) {
            this.currentSize -= this.step;
            this.updateFontSize();
        }
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

        const smallTexts = document.querySelectorAll('.small-text');
        smallTexts.forEach(el => {
            el.style.fontSize = `${this.currentSize * this.scales.small}px`;
        });
    }

    reset() {
        this.currentSize = this.defaultSize;
        this.updateFontSize();
    }
}

// Language Controller
class LanguageController {
    constructor() {
        this.currentLang = 'en';
        this.translations = {};
        this.loadTranslations();
    }

    async loadTranslations() {
        try {
            const response = await fetch('../configs/lang.json');
            this.translations = await response.json();
            // Save the preset
            const savedLang = localStorage.getItem('preferredLanguage');
            if (savedLang && this.translations[savedLang]) {
                this.setLanguage(savedLang);
            }
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            this.updateContent();
            localStorage.setItem('preferredLanguage', lang);
        }
    }

    updateContent() {
        const translation = this.translations[this.currentLang];
        if (!translation) return;

        document.querySelectorAll('[data-translate]').forEach(element => {
            const path = element.dataset.translate.split('.');
            let value = translation;

            for (const key of path) {
                if (value) value = value[key];
            }

            if (value) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = value;
                } else {
                    element.textContent = value;
                }
            }
        });
    }

    getCurrentLanguage() {
        return this.currentLang;
    }
}

const fontController = new FontSizeController();
const langController = new LanguageController();

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Query all buttons at once
    
    const fontIncreaseBtn = document.querySelector('#fontInc')
    const fontDecreaseBtn = document.querySelector('#fontDec')
    const cnBtn = document.querySelector('#cn')
    const enBtn = document.querySelector('#en')
    const deBtn = document.querySelector('#de')
    

    // Add event listeners with error handling
    fontIncreaseBtn.addEventListener('click', () => fontController.increase());
    fontDecreaseBtn.addEventListener('click', () => fontController.decrease());
    cnBtn.addEventListener('click', () => {
        langController.setLanguage('zh');
        console.log('Chinese button clicked');
    });

    enBtn.addEventListener('click', () => langController.setLanguage('en'));
    deBtn.addEventListener('click', () => langController.setLanguage('de'));

    // Load saved language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && ['en', 'zh', 'de'].includes(savedLang)) {
        langController.setLanguage(savedLang);
    }
});