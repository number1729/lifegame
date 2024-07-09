let width = 30;
let height = 30;
let board = [];
let isRunning = false;
let intervalId;

const gameBoard = document.getElementById('gameBoard');
const statusIndicator = document.getElementById('statusIndicator');
gameBoard.style.gridTemplateColumns = `repeat(${width}, 15px)`;

function createBoard() {
    for (let i = 0; i < height; i++) {
        board[i] = [];
        for (let j = 0; j < width; j++) {
            board[i][j] = 0;
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', toggleCell);
            gameBoard.appendChild(cell);
        }
    }
    console.log(board);
}

function toggleCell(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    board[row][col] = 1 - board[row][col];
    event.target.classList.toggle('alive');
}

function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        if (board[row][col] === 1) {
            cell.classList.add('alive');
        } else {
            cell.classList.remove('alive');
        }
    });
}

function countNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const newRow = (row + i + height) % height;
            const newCol = (col + j + width) % width;
            count += board[newRow][newCol];
        }
    }
    return count;
}

function nextGeneration() {
    const newBoard = board.map(row => [...row]);
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const neighbors = countNeighbors(i, j);
            if (board[i][j] === 1) {
                if (neighbors < 2 || neighbors > 3) {
                    newBoard[i][j] = 0;
                }
            } else {
                if (neighbors === 3) {
                    newBoard[i][j] = 1;
                }
            }
        }
    }
    board = newBoard;
    updateBoard();
}

function startGame() {
    if (!isRunning) {
        isRunning = true;
        intervalId = setInterval(nextGeneration, 100);
        statusIndicator.textContent = '実行中';
        statusIndicator.classList.remove('stopped');
        statusIndicator.classList.add('running');
    }
}

function stopGame() {
    if (isRunning) {
        isRunning = false;
        clearInterval(intervalId);
        statusIndicator.textContent = '停止中';
        statusIndicator.classList.remove('running');
        statusIndicator.classList.add('stopped');
    }
}

function clearBoard() {
    stopGame();
    board = board.map(row => row.map(() => 0));
    updateBoard();
}

function randomizeBoard() {
    stopGame();
    board = board.map(row => row.map(() => Math.random() > 0.7 ? 1 : 0));
    updateBoard();
}

function applySize() {
    const newWidth = parseInt(document.getElementById('width').value);
    const newHeight = parseInt(document.getElementById('height').value);
    console.log(newWidth, newHeight);
    if (newWidth !== width || newHeight !== height) {
        width = newWidth;
        height = newHeight;
        gameBoard.style.gridTemplateColumns = `repeat(${width}, 15px)`;
        board = [];
        gameBoard.innerHTML = ''; 
        createBoard();
    }
}

// チェックボックスを動的に生成する関数
function createCheckboxes(containerId, name, values, checkedValues) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // 既存のコンテンツをクリア

    values.forEach((value) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = name;
        input.value = value;
        if (checkedValues.includes(value)) {
            input.checked = true;
        }
        label.appendChild(input);
        label.appendChild(document.createTextNode(value));
        container.appendChild(label);
        container.appendChild(document.createElement('br')); // 改行を追加
    });
}

// 初期設定
const survivalValues = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // 生存ルールの選択肢
const birthValues = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // 誕生ルールの選択肢
const initialSurvivalValues = [2, 3]; // 初期選択される生存ルール
const initialBirthValues = [3]; // 初期選択される誕生ルール

createCheckboxes('survivalRule', 'survivalRule', survivalValues, initialSurvivalValues);
createCheckboxes('birthRule', 'birthRule', birthValues, initialBirthValues);

document.getElementById('applyRules').addEventListener('click', function() {
    // 生存ルールの取得
    const survivalRule = [];
    document.getElementsByName('survivalRule').forEach((checkbox) => {
        if (checkbox.checked) {
            survivalRule.push(checkbox.value);
        }
    });

    // 誕生ルールの取得
    const birthRule = [];
    document.getElementsByName('birthRule').forEach((checkbox) => {
        if (checkbox.checked) {
            birthRule.push(checkbox.value);
        }
    });
});

document.getElementById('tutorialToggle').addEventListener('click', () => {
    const tutorial = document.getElementById('tutorial');
    const tutorialToggle = document.getElementById('tutorialToggle');
    tutorial.classList.toggle('show');
    tutorialToggle.classList.toggle('active');
});

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('stopBtn').addEventListener('click', stopGame);
document.getElementById('clearBtn').addEventListener('click', clearBoard);
document.getElementById('randomBtn').addEventListener('click', randomizeBoard);
document.getElementById('applySize').addEventListener('click', applySize);
document.getElementById('applyRules').addEventListener('click', applyRules);

createBoard();
