class ChordsPagination {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 1;
        this.chords = [];
        this.totalPages = 1;
        this.initializeElements();
        this.bindEvents();
        this.langController = window.langController;
        this.fontController = window.fontController;
        this.initialize();
    }

    initializeElements() {
        const elements = ['prev-page', 'next-page', 'current-page', 'total-pages', 'chords-container'];
        elements.forEach(id => {
            this[id.replace('-', '')] = document.getElementById(id);
        });
    }

    bindEvents() {
        this.prevpage.addEventListener('click', () => this.changePage(-1));
        this.nextpage.addEventListener('click', () => this.changePage(1));
    }

    async initialize() {
        try {
            const response = await fetch('../configs/chords.json');
            const data = await response.json();
            this.chords = data.chords;

            this.totalPages = Math.ceil(this.chords.length / this.itemsPerPage);
            this.totalpages.textContent = this.totalPages;
            this.displayChords();
        } catch (error) {
            console.error('Error loading chords:', error);
        }
    }

    async displayChords() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const pageChords = this.chords.slice(start, start + this.itemsPerPage);
        
        this.chordscontainer.innerHTML = pageChords
            .map(chord => this.createChordCard(chord))
            .join('');
            
        this.updatePaginationControls();
        
        if (this.langController) {
            await this.langController.updateContent();
        }
    }

    createChordCard(chord) {
        const { name, noteImage, chordImage, description } = chord;
        return `
            <div class="chord-card">
                <h3>${name}</h3>
                <div class="chord-images">
                    <img src="${noteImage}" alt="${name} note diagram">
                    <img src="${chordImage}" alt="${name} chord diagram">
                </div>
                <p data-translate="chords.${name}">${typeof description === 'object' 
                    ? description[localStorage.getItem('preferredLanguage') || 'en'] 
                    : description}</p>
            </div>`;
    }

    updatePaginationControls() {
        this.currentpage.textContent = this.currentPage;
        this.prevpage.disabled = this.currentPage === 1;
        this.nextpage.disabled = this.currentPage === this.totalPages;
    }

    async changePage(delta) {
        const newPage = this.currentPage + delta;
        if (newPage >= 1 && newPage <= this.totalPages) {
            this.currentPage = newPage;
            await this.displayChords(); 
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.langController = window.langController || new LanguageController();
    window.chordsPagination = new ChordsPagination();
    window.fontController = window.fontController || new FontSizeController();
});

