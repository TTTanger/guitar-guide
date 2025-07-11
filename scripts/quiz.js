const chordData = {
    'C': ['C', 'E', 'G'],
    'Dm': ['D', 'F', 'A'],
    'Em': ['E', 'G', 'B'],
    'F': ['F', 'A', 'C'],
    'G': ['G', 'B', 'D'],
    'Am': ['A', 'C', 'E']
};
const notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const chordsImgs = {
    'C': '../images/C_example.jpg',
    'Dm': '../images/Dm_example.jpg',
    'Em': '../images/Em_example.jpg',
    'F': '../images/F_example.jpg',
    'G': '../images/G_example.jpg',
    'Am': '../images/Am_example.jpg'
}

let score = 0;
let questionIndex = 0;
let cateFlag = null;

document.addEventListener('DOMContentLoaded', function () {
    const startBtn = document.getElementById('start-btn');
    const quizContainer = document.getElementById('quiz-container');
    const quizSettings = document.getElementById('quiz-settings');
    const questionCount = document.getElementById('question-count');

    startBtn.addEventListener('click', function () {
        console.log('startBtn clicked');
        quizContainer.style.display = 'block';
        quizSettings.style.display = 'none';
        cateFlag = getRandomCate();
        const questionObj = generateQuestion(cateFlag);
        renderQuestion(quizContainer, questionObj, questionIndex, questionCount.value);
    });
});

function getRandomCate() {
    if (Math.random() < 0.5) {
        return 'note';
    }
    else {
        return 'img';
    }
}
function getRandomNote() {
    const randomIndex = Math.floor(Math.random() * (notes.length - 1));
    const availableNotes = notes.filter(note => note !== 'B');
    return availableNotes[randomIndex];
}
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}


function generateQuestion(cateFlag) {
    let correctChord = null;
    const bassNote = getRandomNote();
    console.log("Bass note: " + bassNote);
    const wrongOptions = [];

    for (const chord in chordData) {
        if (chordData[chord][0] === bassNote) {
            correctNotes = chordData[chord];
            correctChord = chord;
            console.log("Correct chord: " + correctChord);
            console.log("Correct notes: " + correctNotes);
            break;
        }
    }

    if (cateFlag === 'note') {
        const correctStr = correctNotes.slice().sort().join(' ');
        while (wrongOptions.length < 3) {
            const shuffled = shuffle(notes);
            const optionArr = [];
            for (let i = 0; optionArr.length < 3 && i < shuffled.length; i++) {
                if (!optionArr.includes(shuffled[i])) {
                    optionArr.push(shuffled[i]);
                }
            }
            const optionStr = optionArr.slice().sort().join(',');

            if (optionStr !== correctStr && !wrongOptions.includes(optionStr)) {
                wrongOptions.push(optionStr);
            }
        }

        // Randomly insert the correct answer
        const options = wrongOptions.slice();
        console.log("OptionsOld: " + options);
        const answerIndex = Math.floor(Math.random() * 4);
        options.splice(answerIndex, 0, correctNotes);

        console.log(options);
        // Return Note questionObj
        return {
            type: 'note',
            correctChord: correctChord,
            options: options,
            answer: answerIndex
        };
    }
    else {
        const correctImg = chordsImgs[correctChord];
        const wrongImgs = Object.keys(chordData)
            .filter(chord => chord !== correctChord)
            .map(chord => chordsImgs[chord]);
        const shuffledWrongImgs = wrongImgs.sort(() => Math.random() - 0.5).slice(0, 3);

        const options = shuffledWrongImgs.slice();
        const answerIndex = Math.floor(Math.random() * 4);
        options.splice(answerIndex, 0, correctImg);

        console.log(options);
        return {
            type: 'img',
            correctChord: correctChord,
            options: options,
            answer: answerIndex
        };
    }
}

function handleAnswer(optionsContainer, questionObj, selectedIdx) {
    const quizContainer = document.getElementById('quiz-container');
    const isCorrect = selectedIdx === questionObj.answer;
    if (isCorrect) {
        score++;
    }
    const options = optionsContainer.querySelectorAll('.option-btn');
    let feedback = document.getElementById('quiz-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.id = 'quiz-feedback';
        quizContainer.appendChild(feedback);
    }
    feedback.textContent = isCorrect ? 'Correct!' : 'Wrong!';
    feedback.style.color = isCorrect ? 'green' : 'red';

    /* Standard usage of forEach generated by Claude 3.5 Sonnet
        array.forEach(function(element, index, array) {
            // element: current element
            // index: index of the current element
            // array: the original array itself
        });
    */
    options[selectedIdx].classList.add(isCorrect ? 'correct' : 'incorrect');
    options[questionObj.answer].classList.add('correct');
    btns = optionsContainer.querySelectorAll('.option-btn');
    btns.forEach(btn => {
        btn.disabled = true;
    });
    const nextBtn = document.getElementById('next-btn');
    nextBtn.disabled = false;
}

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
    } else {
        qText.setAttribute('data-translate', 'quiz.imgQuestion');
        questionObj.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.id = 'img-btn';
            const fingerImg = document.createElement('img');
            fingerImg.src = opt;
            btn.appendChild(fingerImg);
            btn.onclick = function () {
                handleAnswer(optionsContainer, questionObj, idx);
            };
            optionsContainer.appendChild(btn);
        });
    }

    
    quizContainer.appendChild(optionsContainer);

    const qNum = document.createElement('div');
    qNum.textContent = `${questionIndex + 1} / ${totalQuestions}`;
    quizContainer.appendChild(qNum);

    const functionButtonContainer = document.createElement('div');
    functionButtonContainer.className = 'function-button-container';

    const quitBtn = document.createElement('button');
    quitBtn.textContent = 'Quit';
    quitBtn.className = 'primary-btn';
    quitBtn.id = 'quit-btn';
    quitBtn.setAttribute('data-translate', 'quiz.quit');
    quitBtn.onclick = function () {
        showResult(quizContainer, score, totalQuestions);
    };
    functionButtonContainer.appendChild(quitBtn);

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.className = 'primary-btn';
    nextBtn.id = 'next-btn';
    nextBtn.setAttribute('data-translate', 'quiz.next');
    nextBtn.onclick = function () {
        questionIndex++;
        if (questionIndex < totalQuestions) {
            questionObj = generateQuestion(cateFlag);
            renderQuestion(quizContainer, questionObj, questionIndex, totalQuestions);
        } else {
            nextBtn.textContent = 'Show Result';
            nextBtn.disabled = true;
            showResult(quizContainer, score, totalQuestions);
        }
    };
    nextBtn.disabled = true;
    functionButtonContainer.appendChild(nextBtn);

    quizContainer.appendChild(functionButtonContainer);
    cateFlag = getRandomCate();
    langController.updateContent();
}

function showResult(quizContainer, score, totalQuestions) {
    quizContainer.innerHTML = '';
    quizContainer.style.display = 'none';
    const resultContainer = document.getElementById('quiz-result');
    resultContainer.style.display = 'flex';
    const resultBtnContainer = document.createElement('div');
    resultBtnContainer.className = 'function-button-container';

    const restartBtn = document.createElement('button');
    restartBtn.textContent = 'Restart';
    restartBtn.className = 'primary-btn';
    restartBtn.id = 'restart-btn';
    restartBtn.onclick = function () {
        restartQuiz();
    };
    resultBtnContainer.appendChild(restartBtn);

    const backToSettingsBtn = document.createElement('button');
    backToSettingsBtn.textContent = 'Settings';
    backToSettingsBtn.className = 'primary-btn';
    backToSettingsBtn.id = 'back-to-settings-btn';
    backToSettingsBtn.onclick = function () {
        backToSettings();
    };
    resultBtnContainer.appendChild(backToSettingsBtn);

    resultContainer.innerHTML = `
        <h1 data-translate="quiz.showResult"></h1>
        <h4 data-translate="quiz.percent"></h4>
        <span>${score}/${totalQuestions}</span>
        <h4 data-translate="quiz.finalScore"></h4>
        <span>${score}</span>
        </h4>

    `;
    resultContainer.appendChild(resultBtnContainer);
    langController.updateContent();

    // Create form data
    const formData = new FormData();
    formData.append('score', score);

    fetch('../phps/quiz.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function restartQuiz() {
    questionIndex = 0;
    score = 0;
    const quizResult = document.getElementById('quiz-result');
    quizResult.style.display = 'none';
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.style.display = 'block';
    const totalQuestions = document.getElementById('question-count').value;
    const questionObj = generateQuestion(cateFlag);
    renderQuestion(quizContainer, questionObj, questionIndex, totalQuestions);
}

function backToSettings() {
    const quizResult = document.getElementById('quiz-result');
    quizResult.style.display = 'none';
    const quizSettings = document.getElementById('quiz-settings');
    quizSettings.style.display = 'flex';
}