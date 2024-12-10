const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
var flagtext = document.getElementById("flagtext");

let gridSize = 10;  //Default Easy
let cellSize = canvas.width / gridSize;
let grid; 
let mineAmount = 10;



function drawGrid() {
    //Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Border
    ctx.strokeStyle = '#000'; 
    ctx.lineWidth = 1;

    //Draw
    for (let i = 0; i <= gridSize; i++) {
        //Vertical 
        ctx.beginPath();  
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke(); 

        //Horizontal 
        ctx.beginPath();  
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke(); 
    }
    //Array as big as gridsize
    grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
    makeMines();
}

//Difficulty handler
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
            mineAmount = 99;
            flagwords = document.createTextNode("99"); 
            break;
        case 'insane':
            gridSize = 30;
            mineAmount = 150;
            flagwords = document.createTextNode("150"); 
            break;
    }
    
    flagtext.appendChild(flagwords);
    
    //Change size
    cellSize = canvas.width / gridSize;

    drawGrid();
});

function makeMines()
{
    const rows = grid.length;
    const cols = grid[0].length;

    let placedMines = 0;
    while (placedMines < mineAmount) {
        
        let row = Math.floor(Math.random() * rows);
        let col = Math.floor(Math.random() * cols);

        
        if (grid[row][col] === 0) {
            grid[row][col] = 9;
            placedMines++;
        }
    }
    calculateTiles();
}
function calculateTiles() {
    const rows = grid.length;
    const cols = grid[0].length;

    
    grid.forEach((row, rIdx) => {
        row.forEach((cell, cIdx) => {
            
            //Skips bombs
            if (cell === 9) return;

            let mineCount = 0;

            // Check 8 closest
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = rIdx + i;
                    const newCol = cIdx + j;

                    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                        //Increase mine count
                        if (grid[newRow][newCol] === 9) {
                            mineCount++;
                        }
                    }
                }
            }

            //Update
            grid[rIdx][cIdx] = mineCount;
        });
    });

    console.log(grid);
}


drawGrid();
