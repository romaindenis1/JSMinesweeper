const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


let gridSize = 10;  //Default Easy
let cellSize = canvas.width / gridSize;
let grid; 

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
    console.log(grid);
}

//Difficulty handler
document.getElementById('difficulty').addEventListener('change', (event) => {
    
    switch (event.target.value) {
        case 'easy':
            gridSize = 10; 
            break;
        case 'medium':
            gridSize = 15; 
            break;
        case 'hard':
            gridSize = 20; 
            break;
        case 'insane':
            gridSize = 30; 
            break;
    }

    //Change size
    cellSize = canvas.width / gridSize;

    drawGrid();
});


drawGrid();
