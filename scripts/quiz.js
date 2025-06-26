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
let maxQuestions = 5;
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
    quizContainer.innerHTML = `<div id="question-container">
                        <h3 id="question-text"></h3>
                        <h2 id="chord-name"></h2>
                    </div>
                    <div id="options-container"></div>
                    <div id="result-message"></div>`;

    startButton.addEventListener('click', () => {
        maxQuestions = parseInt(questionCountSelect.value);
        currentQuestionNumber = 0;
        score = 0;
        document.querySelector('.quiz-settings').style.display = 'none';
        quizContainer.style.display = 'block';
        createNewQuestion();
        if (window.langController) window.langController.updateContent();
    });
    if (window.langController) {
        if (window.langController.translations && Object.keys(window.langController.translations).length > 0) {
            window.langController.updateContent();
        } else {
            const origLoad = window.langController.loadTranslations;
            window.langController.loadTranslations = async function () {
                await origLoad.apply(this, arguments);
                window.langController.updateContent();
            }
        }
    }
}

function createNewQuestion() {
    if (currentQuestionNumber > maxQuestions) {
        showResults();
        return;
    }

    // Empty the result message
    const resultMessage = document.getElementById('result-message');
    if (resultMessage) {
        resultMessage.innerHTML = '';

        resultMessage.removeAttribute('data-translate');
        resultMessage.style.color = '';
    }

    const chords = Object.keys(chordData);
    currentChord = chords[Math.floor(Math.random() * chords.length)];
    currentQuestionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    document.getElementById('chord-name').textContent = currentChord;
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
    }

    // Translate
    questionText.innerHTML = '';
    if (currentQuestionType === 'notes') {
        questionText.setAttribute('data-translate', 'quiz.notesQuestion');
    } else {
        questionText.setAttribute('data-translate', 'quiz.imgQuestion');
    }
    if (window.langController) window.langController.updateContent();

    if (currentQuestionType === 'notes') {
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

    // 创建按钮容器
    const quizContainer = document.getElementById('quiz-container');
    let buttonContainer = document.querySelector('.button-container');
    if (buttonContainer && buttonContainer.parentNode) {
        buttonContainer.parentNode.removeChild(buttonContainer);
    }
    buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    quizContainer.appendChild(buttonContainer);

    // 退出按钮
    const quitbutton = document.createElement('button');
    quitbutton.className = 'quit-button';
    quitbutton.innerHTML = '<span data-translate="quiz.quit">Quit</span>';
    quitbutton.addEventListener('click', endQuiz);
    buttonContainer.appendChild(quitbutton);

    // 下一题/显示结果按钮
    const nextbutton = document.createElement('button');
    nextbutton.className = 'next-button';

    if (currentQuestionNumber === maxQuestions - 1) {
        nextbutton.innerHTML = '<span data-translate="quiz.showResult">Show Result</span>';
        nextbutton.addEventListener('click', () => {
            currentQuestionNumber++;
            endQuiz();
            showResults();
        });
    } else {
        nextbutton.innerHTML = '<span data-translate="quiz.next">Next</span>';
        nextbutton.addEventListener('click', () => {
            currentQuestionNumber++;
            createNewQuestion();
        });
    }
    buttonContainer.appendChild(nextbutton);

    document.querySelectorAll('.next-button').forEach(btn => btn.disabled = true);
    if (window.langController) window.langController.updateContent();
}

function checkAnswer(selectedAnswer, correctAnswer, type) {
    const buttons = document.querySelectorAll('.option-button');
    let isCorrect = false;

    if (type === 'images') {
        const selectedFileName = selectedAnswer.split('/').pop();
        const correctFileName = correctAnswer.split('/').pop();
        isCorrect = selectedFileName === correctFileName;
        buttons.forEach(button => {
            const buttonImg = button.querySelector('img');
            if (buttonImg) {
                const btnFileName = buttonImg.src.split('/').pop();
                if (btnFileName === correctFileName) {
                    button.classList.add('correct');
                }
                if (btnFileName === selectedFileName && btnFileName !== correctFileName) {
                    button.classList.add('incorrect');
                }
            }
            button.disabled = true;
        });
    } else {
        isCorrect = selectedAnswer === correctAnswer;
        buttons.forEach(button => {
            if (button.textContent === correctAnswer) {
                button.classList.add('correct');
            }
            if (button.textContent === selectedAnswer && selectedAnswer !== correctAnswer) {
                button.classList.add('incorrect');
            }
            button.disabled = true;
        });
    }

    // 只在答对时加分
    if (isCorrect) {
        score++;
    }

    const resultMessage = document.getElementById('result-message');
    if (isCorrect) {
        resultMessage.setAttribute("data-translate", "quiz.correct");
        resultMessage.style.color = 'green';
    } else {
        resultMessage.setAttribute("data-translate", "quiz.incorrect");
        resultMessage.style.color = 'red';
    }

    if (window.langController) window.langController.updateContent();

    document.querySelectorAll('.next-button').forEach(btn => btn.disabled = false);
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
    const quizContainer = document.getElementById('quiz-container');

    // 结果界面内容
    const resultsHTML = `
        <div class="quiz-results">
            <h2 data-translate="quiz.completion">Quiz Complete!</h2>
            <p>
                <span data-translate="quiz.finalScore">Your final score:</span>
                <span id="final-score">${score}</span>/<span id="final-total">${maxQuestions}</span>
            </p>
            <p>
                <span data-translate="quiz.percent">Percentage:</span>
                <span id="final-percent">${Math.round((score / maxQuestions) * 100)}%</span>
            </p>
            <button data-translate="quiz.restart" onclick="restartQuiz()">Try Again</button>
        </div>
    `;
    quizContainer.innerHTML = resultsHTML;

    if (window.langController) window.langController.updateContent();
}

function restartQuiz() {
    initializeQuiz();
    document.querySelector('.quiz-settings').style.display = 'block';
    document.getElementById('quiz-container').style.display = 'none';
    if (window.langController) window.langController.updateContent();
}

document.addEventListener('DOMContentLoaded', () => {
    initializeQuiz();
});