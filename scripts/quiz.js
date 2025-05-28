const chordData = {
    'C': ['C', 'E', 'G'],
    'Dm': ['D', 'F', 'A'],
    'Em': ['E', 'G', 'B'],
    'F': ['F', 'A', 'C'],
    'G': ['G', 'B', 'D'],
    'Am': ['A', 'C', 'E']
};

const chordsImgs = {
    'C': '../images/C_example.jpg',
    'Dm': '../images/Dm_example.jpg',
    'Em': '../images/Em_example.jpg',
    'F': '../images/F_example.jpg',
    'G': '../images/G_example.jpg',
    'Am': '../images/Am_example.jpg'
}

const questionTypes = ['notes', 'images'];
let currentQuestionType;

let currentChord;
let score = 0;
let totalQuestions = 0;
let maxQuestions = 10;
let currentQuestionNumber = 0;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateOptions(correctAnswer) {
    let allNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    let options = [correctAnswer.join(', ')];

    while (options.length < 4) {
        let fakeAnswer = shuffleArray([...allNotes]).slice(0, 3).sort();
        let fakeAnswerString = fakeAnswer.join(', ');
        if (!options.includes(fakeAnswerString)) {
            options.push(fakeAnswerString);
        }
    }

    return shuffleArray(options);
}

function generateImageOptions(correctChord) {
    let options = [chordsImgs[correctChord]];
    const availableChords = Object.keys(chordsImgs).filter(chord => chord !== correctChord);

    while (options.length < 4) {
        const randomChord = availableChords[Math.floor(Math.random() * availableChords.length)];
        const imgPath = chordsImgs[randomChord];
        if (!options.includes(imgPath)) {
            options.push(imgPath);
        }
    }
    return shuffleArray(options);
}

function initializeQuiz() {
    const startButton = document.getElementById('start-quiz');
    const questionCountSelect = document.getElementById('question-count');
    const quizContainer = document.getElementById('quiz-container');

    startButton.addEventListener('click', () => {
        maxQuestions = parseInt(questionCountSelect.value);
        currentQuestionNumber = 0;
        score = 0;
        totalQuestions = 0;
        document.querySelector('.quiz-settings').style.display = 'none';
        quizContainer.style.display = 'block';
        createNewQuestion();
    });
}

function createNewQuestion() {
    currentQuestionNumber++;
    if (currentQuestionNumber > maxQuestions) {
        showResults();
        return;
    }

    const chords = Object.keys(chordData);
    currentChord = chords[Math.floor(Math.random() * chords.length)];
    currentQuestionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    document.getElementById('chord-name').textContent = currentChord;
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    if (currentQuestionType === 'notes') {
        questionText.textContent = 'What notes make up this chord?';
        const correctAnswer = chordData[currentChord];
        const options = generateOptions(correctAnswer);

        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option;
            button.addEventListener('click', () => checkAnswer(option, correctAnswer.join(', '), 'notes'));
            optionsContainer.appendChild(button);
        });
    } else {
        questionText.textContent = 'Which picture shows this chord?';
        const correctImage = chordsImgs[currentChord];
        const options = generateImageOptions(currentChord);

        options.forEach(imgPath => {
            const button = document.createElement('button');
            button.className = 'option-button';
            const img = document.createElement('img');
            img.src = `${imgPath}`;
            img.alt = imgPath;
            button.appendChild(img);
            button.addEventListener('click', () => checkAnswer(imgPath, correctImage, 'images'));
            optionsContainer.appendChild(button);
        });
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    optionsContainer.appendChild(buttonContainer);

    const quitbutton = document.createElement('button');
    quitbutton.id = 'quit-button';
    quitbutton.addEventListener('click', endQuiz);
    quitbutton.innerHTML = 'Quit'
    buttonContainer.appendChild(quitbutton);

    const nextbutton = document.createElement('button');
    nextbutton.id = 'next-button';
    nextbutton.addEventListener('click', createNewQuestion);
    nextbutton.innerHTML = 'Next'
    buttonContainer.appendChild(nextbutton);
    document.getElementById('result-message').textContent = '';
    document.getElementById('next-button').disabled = true;
}

function checkAnswer(selectedAnswer, correctAnswer, type) {
    console.log('Check answer:', {
        selected: selectedAnswer,
        correct: correctAnswer,
        type: type
    });
    const buttons = document.querySelectorAll('.option-button');
    buttons.forEach(button => {
        button.disabled = true;
        if (type === 'images') {
            const buttonImg = button.querySelector('img');
            if (buttonImg && buttonImg.src.includes(correctAnswer)) {
                button.classList.add('correct');
            }
            if (buttonImg && buttonImg.src.includes(selectedAnswer) && selectedAnswer !== correctAnswer) {
                button.classList.add('incorrect');
            }
        } else {
            if (button.textContent === correctAnswer) {
                button.classList.add('correct');
            }
            if (button.textContent === selectedAnswer && selectedAnswer !== correctAnswer) {
                button.classList.add('incorrect');
            }
        }
    });

    const resultMessage = document.getElementById('result-message');
    if (selectedAnswer === correctAnswer) {
        resultMessage.textContent = 'Correct!';
        resultMessage.style.color = 'green';
        score++;
    } else {
        resultMessage.textContent = 'Incorrect. Try again!';
        resultMessage.style.color = 'red';
    }

    totalQuestions++;
    document.getElementById('score').textContent = score;
    document.getElementById('total').textContent = totalQuestions;
    document.getElementById('next-button').disabled = false;

    // Check if the maximum number of questions has been reached
    if (totalQuestions >= maxQuestions) {
        endQuiz();
    }
}

// Function to end the quiz
function endQuiz() {
    // Update the best score
    const formData = new FormData();
    formData.append('score', score);
    fetch("../phps/quiz.php", {
        method: "POST",
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch(error => console.error("Error:", error));

    showResults();
}

function showResults() {
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    const resultMessage = document.getElementById('result-message');
    resultMessage.innerHTML = '';

    const resultsHTML = `
        <div class="quiz-results">
            <h2>Quiz Complete!</h2>
            <p>Your final score: ${score}/${maxQuestions}</p>
            <p>Percentage: ${Math.round((score / maxQuestions) * 100)}%</p>
            <button onclick="restartQuiz()">Try Again</button>
        </div>
    `;
    optionsContainer.innerHTML = resultsHTML;

    document.getElementById('question-text').textContent = '';
    document.getElementById('chord-name').textContent = '';
}

function restartQuiz() {
    document.querySelector('.quiz-settings').style.display = 'block';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('score').textContent = '0';
    document.getElementById('total').textContent = '0';
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeQuiz();
});