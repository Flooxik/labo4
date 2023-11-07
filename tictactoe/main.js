const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restartButton');
const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
let circleTurn;
let xWins = 0;
let oWins = 0;

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
    circleTurn = false;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove(X_CLASS, CIRCLE_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
        updateScore(currentClass);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
    }
}

function endGame(draw) {
    if (draw) {
        alert('Ничья!');
    } else {
        const winner = circleTurn ? "O's" : "X's";
        alert(`${winner} wins!`);
    }
    startGame();
}

function updateScore(winnerClass) {
    if (winnerClass === X_CLASS) {
        xWins++;
    } else {
        oWins++;
    }
    document.getElementById('x-wins').textContent = `X Wins: ${xWins}`;
    document.getElementById('o-wins').textContent = `O Wins: ${oWins}`;
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.textContent === 'X' || cell.textContent === 'O';
    });
}

function placeMark(cell, currentClass) {
    cell.textContent = currentClass === X_CLASS ? 'X' : 'O';
}

function swapTurns() {
    circleTurn = !circleTurn;
}

function checkWin(currentClass) {
    const winCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].textContent === (currentClass === X_CLASS ? 'X' : 'O');
        });
    });
}

function updateScore(winnerClass) {
    if (winnerClass === X_CLASS) {
        xWins++;
        document.getElementById('x-wins').textContent = `X Побед: ${xWins}`;
    } else {
        oWins++;
        document.getElementById('o-wins').textContent = `O Побед: ${oWins}`;
    }
}