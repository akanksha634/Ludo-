// Game state
const gameState = {
  players: [
    { id: 1, name: 'Red', color: '#e74c3c', pieces: [-1, -1, -1, -1], startPos: 0, homePos: 56 },
    { id: 2, name: 'Green', color: '#2ecc71', pieces: [-1, -1, -1, -1], startPos: 14, homePos: 70 },
    { id: 3, name: 'Yellow', color: '#f1c40f', pieces: [-1, -1, -1, -1], startPos: 28, homePos: 84 },
    { id: 4, name: 'Blue', color: '#3498db', pieces: [-1, -1, -1, -1], startPos: 42, homePos: 98 }
  ],
  currentPlayer: 0,
  diceValue: 0,
  diceRolled: false,
  paths: {
    red: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56],
    green: [14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70],
    yellow: [28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84],
    blue: [42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98]
  },
  safePositions: [0, 8, 13, 21, 26, 34, 39, 47],
  winningPositions: [56, 70, 84, 98]
};

// DOM elements
const playerInfoEl = document.getElementById('playerInfo');
const diceEl = document.getElementById('dice');
const diceResultEl = document.getElementById('diceResult');
const rollButton = document.getElementById('rollButton');
const boardEl = document.querySelector('.board');
const gameMessageEl = document.getElementById('gameMessage');

// Initialize game
function initGame() {
  // Set up event listeners
  rollButton.addEventListener('click', rollDice);
  
  // Create board
  createBoard();
  
  // Initialize pieces in bases
  initializePieces();
  
  // Start game
  updatePlayerInfo();
}

// Create Ludo board
function createBoard() {
  boardEl.innerHTML = '';
  
  // Create main path cells
  for (let i = 0; i < 56; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell path-cell';
    cell.dataset.position = i;
    cell.dataset.type = 'path';
    boardEl.appendChild(cell);
  }
  
  // Create home paths
  for (let color in gameState.paths) {
    const path = gameState.paths[color];
    for (let i = 0; i < path.length; i++) {
      const existingCell = document.querySelector(`.cell[data-position="${path[i]}"]`);
      if (!existingCell) {
        const cell = document.createElement('div');
    cell.className = `cell path-cell ${color}-path ${color}`;
        cell.dataset.position = path[i];
        cell.dataset.type = 'home-path';
        boardEl.appendChild(cell);
      }
    }
  }
}

// Initialize pieces in their bases
function initializePieces() {
  gameState.players.forEach(player => {
    const baseEl = document.getElementById(`${player.name.toLowerCase()}Base`);
    for (let i = 0; i < 4; i++) {
      const piece = document.createElement('div');
      piece.className = `piece ${player.color.toLowerCase()}`;
      piece.dataset.player = player.id;
      piece.dataset.piece = i;
      piece.addEventListener('click', () => handlePieceClick(player.id, i));
      baseEl.appendChild(piece);
    }
  });
}

// Update player info display
function updatePlayerInfo() {
  const currentPlayer = gameState.players[gameState.currentPlayer];
  playerInfoEl.innerHTML = `
    <h3>Current Player: ${currentPlayer.name}</h3>
    <p>Color: <span class="${currentPlayer.color.toLowerCase()}">${currentPlayer.name}</span></p>
  `;
  gameMessageEl.textContent = '';
}

// Roll dice function
function rollDice() {
  if (gameState.diceRolled) {
    gameMessageEl.textContent = "You already rolled! Move a piece first.";
    return;
  }

  // Animate dice
  diceEl.style.transform = 'rotate(360deg)';
  setTimeout(() => {
    diceEl.style.transform = 'rotate(0deg)';
    gameState.diceValue = Math.floor(Math.random() * 6) + 1;
    diceEl.textContent = getDiceFace(gameState.diceValue);
    diceResultEl.textContent = `You rolled: ${gameState.diceValue}`;
    gameState.diceRolled = true;
    
    // Check for possible moves
    checkPossibleMoves();
  }, 500);
}

// Get dice face emoji
function getDiceFace(value) {
  const faces = ['⚀', '⚁', '⚂', '⚄', '⚅'];
  return faces[value - 1] || '🎲';
}

// Handle piece click
function handlePieceClick(playerId, pieceIndex) {
  if (!gameState.diceRolled || playerId !== gameState.players[gameState.currentPlayer].id) {
    return;
  }

  const player = gameState.players.find(p => p.id === playerId);
  const piecePos = player.pieces[pieceIndex];
  
  // If piece is in base and dice is 6, move to start
  if (piecePos === -1) {
    if (gameState.diceValue === 6) {
      movePieceToStart(player, pieceIndex);
    }
    return;
  }
  
  // Calculate new position
  const path = gameState.paths[player.color.toLowerCase()];
  const currentIndex = path.indexOf(piecePos);
  const newIndex = currentIndex + gameState.diceValue;
  
  if (newIndex >= path.length) {
    gameMessageEl.textContent = "Invalid move!";
    return;
  }
  
  const newPos = path[newIndex];
  
  // Check if position is occupied by own piece
  if (isPositionOccupied(newPos, playerId)) {
    gameMessageEl.textContent = "Can't land on your own piece!";
    return;
  }
  
  // Move the piece
  movePiece(player, pieceIndex, newPos);
}

// Move piece to start position
function movePieceToStart(player, pieceIndex) {
  player.pieces[pieceIndex] = player.startPos;
  renderPieces();
  endTurn();
}

// Move piece to new position
function movePiece(player, pieceIndex, newPos) {
  // Check if capturing opponent's piece
  const capturedPlayer = getPlayerAtPosition(newPos);
  if (capturedPlayer && capturedPlayer.id !== player.id) {
    capturePiece(capturedPlayer, newPos);
  }
  
  // Update piece position
  player.pieces[pieceIndex] = newPos;
  
  // Check for win
  if (gameState.winningPositions.includes(newPos)) {
    checkWin(player);
    return;
  }
  
  renderPieces();
  endTurn();
}

// Capture opponent's piece
function capturePiece(player, position) {
  const pieceIndex = player.pieces.indexOf(position);
  if (pieceIndex !== -1) {
    player.pieces[pieceIndex] = -1; // Return to base
    gameMessageEl.textContent = `Captured ${player.name}'s piece!`;
  }
}

// Check for possible moves
function checkPossibleMoves() {
  const player = gameState.players[gameState.currentPlayer];
  let hasValidMove = false;
  
  // Check pieces in base
  if (gameState.diceValue === 6) {
    for (let i = 0; i < 4; i++) {
      if (player.pieces[i] === -1) {
        hasValidMove = true;
        break;
      }
    }
  }
  
  // Check pieces on board
  for (let i = 0; i < 4; i++) {
    if (player.pieces[i] !== -1) {
      const path = gameState.paths[player.color.toLowerCase()];
      const currentIndex = path.indexOf(player.pieces[i]);
      if (currentIndex + gameState.diceValue < path.length) {
        hasValidMove = true;
        break;
      }
    }
  }
  
  if (!hasValidMove) {
    gameMessageEl.textContent = "No valid moves! Turn skipped.";
    setTimeout(endTurn, 1500);
  }
}

// Check if position is occupied
function isPositionOccupied(position, playerId) {
  for (const player of gameState.players) {
    if (player.pieces.includes(position) && player.id === playerId) {
      return true;
    }
  }
  return false;
}

// Get player at position
function getPlayerAtPosition(position) {
  for (const player of gameState.players) {
    if (player.pieces.includes(position)) {
      return player;
    }
  }
  return null;
}

// Check for win condition
function checkWin(player) {
  if (player.pieces.every(pos => gameState.winningPositions.includes(pos))) {
    gameMessageEl.textContent = `${player.name} player wins!`;
    rollButton.disabled = true;
  } else {
    renderPieces();
    endTurn();
  }
}

// Render all pieces on board
function renderPieces() {
  // Clear all pieces from board
  document.querySelectorAll('.piece').forEach(piece => {
    if (!piece.parentElement.classList.contains('base')) {
      piece.remove();
    }
  });
  
  // Place pieces in their current positions
  gameState.players.forEach(player => {
    player.pieces.forEach((position, pieceIndex) => {
      if (position !== -1) {
        const cell = document.querySelector(`.cell[data-position="${position}"]`);
        if (cell) {
          const piece = document.createElement('div');
          piece.className = `piece ${player.color.toLowerCase()}`;
          piece.dataset.player = player.id;
          piece.dataset.piece = pieceIndex;
          piece.addEventListener('click', () => handlePieceClick(player.id, pieceIndex));
          cell.appendChild(piece);
        }
      }
    });
  });
}

// End current player's turn
function endTurn() {
  gameState.diceRolled = false;
  gameState.diceValue = 0;
  diceEl.textContent = '🎲';
  diceResultEl.textContent = '';
  
  // Move to next player
  gameState.currentPlayer = (gameState.currentPlayer + 1) % gameState.players.length;
  updatePlayerInfo();
}

// Initialize game when page loads
window.onload = initGame;
