/**
 * Handles chord card pagination and rendering for the chords page.
 * Loads chord data from JSON, manages pagination, and updates the UI.
 * @author Junzhe Luo
 */
let chords = [];
let currentPage = 1;
const itemsPerPage = 2;

document.addEventListener('DOMContentLoaded', function () {
    const chordsCard = document.getElementById('chords-card');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    /**
     * Loads the chords data from the JSON file and renders the first page.
     * @author Junzhe Luo
     */
    fetch('../configs/chords.json')
        .then(response => response.json())
        .then(data => {
            chords = data.chords;
            renderPage();
        })
        .catch(error => {
            chordsCard.innerHTML = '<p style="color:red;">Failed to load chords data</p>';
            console.error('Failed to load chords.json:', error);
        });

    /**
     * Renders the current page of chord cards and updates navigation state.
     * @author Junzhe Luo
     */
    function renderPage() {
        renderChordCards(chordsCard, chords, currentPage, itemsPerPage);
        updatePageInfo();
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === Math.ceil(chords.length / itemsPerPage);
        langController.updateContent();
    }

    prevBtn.onclick = function() {
        if (currentPage > 1) {
            currentPage--;
            renderPage();
        }
    };
    nextBtn.onclick = function() {
        if (currentPage < Math.ceil(chords.length / itemsPerPage)) {
            currentPage++;
            renderPage();
        }
    };
});

/**
 * Creates a DOM element representing a single chord card.
 * @param {Object} chord The chord data object
 * @returns {HTMLElement} The chord card element
 * @author Junzhe Luo
 */
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

/**
 * Renders a set of chord cards for the given page.
 * @param {HTMLElement} container The container element for the cards
 * @param {Array} chords The array of chord data
 * @param {number} page The current page number
 * @param {number} perPage Number of items per page
 * @author Junzhe Luo
 */
function renderChordCards(container, chords, page, perPage) {
    container.innerHTML = '';
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const pageChords = chords.slice(start, end);
    pageChords.forEach((chord, index) => {
        const card = createChordCard(chord);
        card.id = `chord-card-${start + index}`;
        container.appendChild(card);
    });
}

/**
 * Updates the page info display for current and total pages.
 * @author Junzhe Luo
 */
function updatePageInfo() {
    document.getElementById('current-page').textContent = currentPage;
    document.getElementById('total-pages').textContent = Math.ceil(chords.length / itemsPerPage);
}
