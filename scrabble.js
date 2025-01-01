// Initialize an empty scrabble board
let scrabbleBoard = [];

// Create a 15x15 board filled with empty strings
for (let i = 0; i < 15; i++) {
    scrabbleBoard[i] = new Array(15).fill('');
}

buildScrabble();

// Function to build the scrabble board and add player functionality
function buildScrabble() {
    document.addEventListener('DOMContentLoaded', () => {
        // Create the board container
        const board = document.createElement('div');
        board.id = 'board';
        document.getElementById('main').appendChild(board);
    
        // Define special cells on the board
        const specialCells = {
            0: 'triple-word', 7: 'triple-word', 14: 'triple-word',
            105: 'triple-word', 112: 'star', 210: 'triple-word',
            217: 'triple-word', 224: 'triple-word',
            16: 'double-word', 28: 'double-word', 32: 'double-word',
            42: 'double-word', 48: 'double-word', 56: 'double-word',
            64: 'double-word', 70: 'double-word', 154: 'double-word',
            160: 'double-word', 168: 'double-word', 176: 'double-word',
            182: 'double-word', 192: 'double-word', 196: 'double-word',
            208: 'double-word', 3: 'double-letter', 11: 'double-letter',
            36: 'double-letter', 38: 'double-letter', 45: 'double-letter',
            52: 'double-letter', 59: 'double-letter', 92: 'double-letter',
            96: 'double-letter', 98: 'double-letter', 102: 'double-letter',
            108: 'double-letter', 116: 'double-letter', 122: 'double-letter',
            126: 'double-letter', 128: 'double-letter', 132: 'double-letter',
            165: 'double-letter', 172: 'double-letter', 179: 'double-letter',
            186: 'double-letter', 188: 'double-letter', 213: 'double-letter',
            221: 'double-letter', 20: 'triple-letter', 24: 'triple-letter',
            76: 'triple-letter', 80: 'triple-letter', 84: 'triple-letter',
            88: 'triple-letter', 136: 'triple-letter', 140: 'triple-letter',
            144: 'triple-letter', 148: 'triple-letter', 200: 'triple-letter',
            204: 'triple-letter'
        };
    
        // Create cells for the board
        for (let i = 0; i < 225; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (specialCells[i]) {
                cell.classList.add(specialCells[i]);
                cell.textContent = specialCells[i] === 'triple-word' ? 'TW' :
                                   specialCells[i] === 'double-word' ? 'DW' :
                                   specialCells[i] === 'triple-letter' ? 'TL' :
                                   specialCells[i] === 'double-letter' ? 'DL' :
                                   specialCells[i] === 'star' ? '★' : '';
            } else {
                cell.classList.add('blank');
            }
            board.appendChild(cell);
        }

        // Add event listeners for game controls
        document.getElementById('start-game').addEventListener('click', startGame);
        document.getElementById('swap-letters').addEventListener('click', swapLetters);
    
        function startGame() {
            const numPlayers = document.getElementById('num-players').value;
            const timeLimit = document.getElementById('time-limit').value;
        
            // Show player letter sections based on number of players
            for (let i = 1; i <= 4; i++) {
                document.getElementById(`player${i}-letters`).classList.add('hidden');
            }
            for (let i = 1; i <= numPlayers; i++) {
                document.getElementById(`player${i}-letters`).classList.remove('hidden');
            }
        
            // Initialize game state
            console.log(`Starting game with ${numPlayers} players and ${timeLimit} seconds per turn.`);
        }

        function swapLetters() {
            // Logic to swap letters
            console.log('Swapping letters...');
        }

        // Add player join functionality
        const players = [];
        const playerForm = document.createElement('form');
        playerForm.innerHTML = `
            <input type="text" id="playerName" placeholder="Enter player name" required>
            <button type="submit">Join Game</button>
        `;
        document.getElementById('main').appendChild(playerForm);
    
        playerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const playerName = document.getElementById('playerName').value;
            if (playerName && !players.includes(playerName)) {
                players.push(playerName);
                updatePlayerList();
            }
            playerForm.reset();
        });
    
        // Display player list and scores
        const playerList = document.createElement('div');
        playerList.id = 'playerList';
        document.getElementById('main').appendChild(playerList);
    
        function updatePlayerList() {
            playerList.innerHTML = '<h2>Players</h2>';
            players.forEach(player => {
                const playerDiv = document.createElement('div');
                playerDiv.textContent = `${player}: 0 points`;
                playerList.appendChild(playerDiv);
            });
        }
    
        // Add scoring functionality
        const scores = {};
        board.addEventListener('click', (e) => {
            if (e.target.classList.contains('cell')) {
                const playerName = prompt('Enter your name to score:');
                if (players.includes(playerName)) {
                    scores[playerName] = (scores[playerName] || 0) + 1;
                    updateScores();
                } else {
                    alert('Player not found. Please join the game first.');
                }
            }
        });
    
        function updateScores() {
            playerList.innerHTML = '<h2>Players</h2>';
            players.forEach(player => {
                const playerDiv = document.createElement('div');
                playerDiv.textContent = `${player}: ${scores[player] || 0} points`;
                playerList.appendChild(playerDiv);
            });
        }
    });
}

// Letter scores for Scrabble
const letterScores = {
    'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1, 'F': 4, 'G': 2, 'H': 4, 'I': 1, 'J': 8, 'K': 5, 'L': 1, 'M': 3,
    'N': 1, 'O': 1, 'P': 3, 'Q': 10, 'R': 1, 'S': 1, 'T': 1, 'U': 1, 'V': 4, 'W': 4, 'X': 8, 'Y': 4, 'Z': 10
};

// Function to calculate the score of a word
function getWordScore(word) {
    return word.toUpperCase().split('').reduce((score, letter) => score + (letterScores[letter] || 0), 0);
}

// Fetch the dictionary from a file
async function fetchDictionary() {
    const response = await fetch('dictionary.txt');
    if (!response.ok) {
        throw new Error('Failed to fetch dictionary');
    }
    const text = await response.text();
    const words = text.split('\n').map(word => word.trim().toUpperCase());
    return new Set(words);
}

// Load the dictionary
let dictionary = [];
fetchDictionary().then(data => {
    dictionary = data;
}).catch(error => {
    console.error('Error fetching dictionary:', error);
});

// Function to check if a word is valid
function isValidWord(word) {
    return dictionary.includes(word.toUpperCase());
}

// Piece distribution for Scrabble
const pieceDistribution = {
    'A': 9, 'B': 2, 'C': 2, 'D': 4, 'E': 12, 'F': 2, 'G': 3, 'H': 2, 'I': 9, 'J': 1, 'K': 1, 'L': 4, 'M': 2,
    'N': 6, 'O': 8, 'P': 2, 'Q': 1, 'R': 6, 'S': 4, 'T': 6, 'U': 4, 'V': 2, 'W': 2, 'X': 1, 'Y': 2, 'Z': 1,
    ' ': 2 // Blank tiles
};

// Function to draw a piece from the bag
function drawPiece() {
    const pieces = [];
    for (const [letter, count] of Object.entries(pieceDistribution)) {
        for (let i = 0; i < count; i++) {
            pieces.push(letter);
        }
    }
    const randomIndex = Math.floor(Math.random() * pieces.length);
    const drawnPiece = pieces[randomIndex];
    pieceDistribution[drawnPiece]--;
    return drawnPiece;
}
