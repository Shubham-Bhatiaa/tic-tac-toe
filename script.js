const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset");
const winningLine = document.getElementById("winning-line");

let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const winningConditions = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal
  [2, 4, 6] // Diagonal
];

function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

  if (gameState[clickedCellIndex] !== "" || !gameActive) {
    return;
  }

  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;

  checkForWinner();
}

function checkForWinner() {
  let roundWon = false;

  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (gameState[a] === "" || gameState[b] === "" || gameState[c] === "") {
      continue;
    }

    if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
      roundWon = true;
      drawWinningLine(a, c); // Draw winning line
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (!gameState.includes("")) {
    statusText.textContent = "Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `It's ${currentPlayer}'s turn`;
}

function drawWinningLine(start, end) {
  const startCell = cells[start].getBoundingClientRect();
  const endCell = cells[end].getBoundingClientRect();
  const boardRect = board.getBoundingClientRect();

  const startX = startCell.left + startCell.width / 2 - boardRect.left;
  const startY = startCell.top + startCell.height / 2 - boardRect.top;
  const endX = endCell.left + endCell.width / 2 - boardRect.left;
  const endY = endCell.top + endCell.height / 2 - boardRect.top;

  const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

  winningLine.style.width = `${length}px`;
  winningLine.style.transform = `rotate(${angle}deg)`;
  winningLine.style.left = `${startX}px`;
  winningLine.style.top = `${startY}px`;
  winningLine.style.display = "block";
}

function resetGame() {
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  statusText.textContent = `It's ${currentPlayer}'s turn`;
  cells.forEach((cell) => (cell.textContent = ""));
  winningLine.style.display = "none";
}

cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
resetButton.addEventListener("click", resetGame);
