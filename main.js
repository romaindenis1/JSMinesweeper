const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
var flagtext = document.getElementById("flagtext");

let gridSize = 10;  // Default Easy
let cellSize = canvas.width / gridSize;
let grid = [];
let mineAmount = 10; // Default for easy
let flaggedCount = 0; // Track flagged cells

let firstClick = true;
let firstClickPosition = null;
const flagImage = new Image();
flagImage.src = "./Images/flag.png";

/////////////////////////////////////////////////////TODO : Make firstclick logic work on hard and insane difficulties/////////////////////////////////////////////////////////////

// Makes grid
function initializeGrid() {
    grid = [];
    for (let row = 0; row < gridSize; row++) {
        grid[row] = [];
        for (let col = 0; col < gridSize; col++) {
            grid[row][col] = {
                value: 0,
                revealed: false,
                flagged: false
            };
        }
    }
    
    placeMines();
    calculateTiles();
}

// Draw the grid
function drawGrid() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Style
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;

    // Draw the grid lines
    for (let i = 0; i <= gridSize; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();

        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }

    // Render the grid cells
    grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            let x = colIndex * cellSize;
            let y = rowIndex * cellSize;

            // Styles for revealed cells
            if (cell.revealed) {
                if (cell.value === 9) {
                    ctx.fillStyle = 'red';  // Mine 
                } 
                else if ((rowIndex + colIndex) % 2 === 0) {
                    ctx.fillStyle = '#C3B59F';  
                } else {
                    ctx.fillStyle = '#A57F60';
                }
            
            } else {
                // Alternate colors for unrevealed cells
                if ((rowIndex + colIndex) % 2 === 0) {
                    ctx.fillStyle = '#2f2f2f';  // One color for unrevealed cells
                } else {
                    ctx.fillStyle = '#3a3a3a';  // Another color for unrevealed cells
                }
            }

            ctx.fillRect(x, y, cellSize, cellSize);

            // Center numbers for revealed cells
            if (cell.revealed && cell.value !== 0) {
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(cell.value, x + cellSize / 2, y + cellSize / 2);
            }

            // Draw flag
            if (cell.flagged) {
                ctx.drawImage(flagImage, x + cellSize / 4, y + cellSize / 4, cellSize / 2, cellSize / 2);
            }
        });
    });

    // Update the flag count display
    flagtext.innerHTML = `${mineAmount - flaggedCount}`;
}

// Difficulty handler
document.getElementById('difficulty').addEventListener('change', (event) => {
    flagtext.innerHTML = '';
    let flagwords;
    switch (event.target.value) {
        case 'easy':
            gridSize = 10;
            mineAmount = 10;
            flagwords = document.createTextNode("10");
            break;
        case 'medium':
            gridSize = 15;
            mineAmount = 40;
            flagwords = document.createTextNode("40");
            break;
        case 'hard':
            gridSize = 20;
            mineAmount = 95;
            flagwords = document.createTextNode("99");
            break;
        case 'insane':
            gridSize = 30;
            mineAmount = 150;
            flagwords = document.createTextNode("150");
            break;
    }

    flagtext.appendChild(flagwords);
    cellSize = canvas.width / gridSize;

    initializeGrid(); // Reset grid
    drawGrid();
});

// Random mines
function placeMines() {
    const rows = grid.length;
    const cols = grid[0].length;
    let placedMines = 0;

    while (placedMines < mineAmount) {
        let row = Math.floor(Math.random() * rows);
        let col = Math.floor(Math.random() * cols);

        // So mines aren't placed on firstclick or around
        if (grid[row][col].value === 0 && !isFirstClickArea(row, col)) {
            grid[row][col].value = 9;
            placedMines++;
        }
    }
}

// Check if the position is in the first click area
function isFirstClickArea(row, col) {
    if (!firstClickPosition) return false;

    const [firstRow, firstCol] = firstClickPosition;
    return (
        Math.abs(firstRow - row) <= 1 &&
        Math.abs(firstCol - col) <= 1
    );
}

// Calculate numbered cells
function calculateTiles() {
    const rows = grid.length;
    const cols = grid[0].length;

    grid.forEach((row, rIdx) => {
        row.forEach((cell, cIdx) => {
            // Skip mines
            if (cell.value === 9) return;

            let mineCount = 0;

            // Check neighbor cells for mines
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = rIdx + i;
                    const newCol = cIdx + j;

                    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                        if (grid[newRow][newCol].value === 9) {
                            mineCount++;
                        }
                    }
                }
            }

            // Update
            grid[rIdx][cIdx].value = mineCount;
        });
    });
}

// Reveal cell function
function revealCell(row, col) {
    if (grid[row][col].revealed || grid[row][col].flagged) return;  // Don't reveal flagged cells
    grid[row][col].revealed = true;

    if (grid[row][col].value === 0) {
        // Reveal neighboring cells if empty (no number or mine)
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                    revealCell(newRow, newCol);
                }
            }
        }
    }
    drawGrid();
}

// Setup
function initializeGame() {
    firstClick = true;
    firstClickPosition = null;
    flaggedCount = 0; // Reset the flag count
    initializeGrid();
    drawGrid();
}

initializeGame();

// Event listener for left click (reveal cells)
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);

    // Check if firstclick
    if (firstClick) {
        firstClickPosition = [row, col];
        firstClick = false;
        initializeGrid();   // Remake final grid
    }

    revealCell(row, col);
});

// Event listener for right click (flag/unflag cells)
canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault(); // Prevent right-click menu from appearing
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);

    const cell = grid[row][col];

    // Toggle the flagged state of the cell
    if (!cell.revealed) {
        if (cell.flagged) {
            cell.flagged = false;
            flaggedCount--;
        } else {
            cell.flagged = true;
            flaggedCount++;
        }
        drawGrid();  // Update the grid display
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'r' || event.key === 'R') {
        firstClick = true;
        initializeGame();
    }
});