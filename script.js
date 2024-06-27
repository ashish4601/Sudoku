// Selecting the board container
const board = document.getElementById('board');

// Initial Sudoku grid
let grid = [
    [8, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 3, 6, 0, 0, 0, 0, 0],
    [0, 7, 0, 0, 9, 0, 2, 0, 0],
    [0, 5, 0, 0, 0, 7, 0, 0, 0],
    [0, 0, 0, 0, 4, 5, 7, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 3, 0],
    [0, 0, 1, 0, 0, 0, 0, 6, 8],
    [0, 0, 8, 5, 0, 0, 0, 1, 0],
    [0, 9, 0, 0, 0, 0, 4, 0, 0]
];

// Check if initial grid is valid
function checkInitialGrid(grid) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] !== 0) {
                if (!isValid(grid, i, j, grid[i][j])) {
                    return false;
                }
            }
        }
    }
    return true;
}

// Function to create the Sudoku board
function createBoard() {
    board.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.className = 'cell';
            cell.value = grid[i][j] !== 0 ? grid[i][j] : '';
            cell.readOnly = grid[i][j] !== 0;
            cell.dataset.row = i;
            cell.dataset.col = j;
            board.appendChild(cell);
        }
    }
}

// Function to update the grid from the input fields
function updateGrid() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        grid[row][col] = cell.value !== '' ? parseInt(cell.value) : 0;
    });
}

// Function to check if a value is valid at a position
function isValid(board, row, col, num) {
    // Check row and column
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num && i !== col) {
            return false;
        }
        if (board[i][col] === num && i !== row) {
            return false;
        }
    }

    // Check 3x3 grid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (board[i][j] === num && (i !== row || j !== col)) {
                return false;
            }
        }
    }

    return true;
}


// Function to solve Sudoku using backtracking
async function solveSudoku() {
    updateGrid();
    // Check if initial grid is valid
    if (!checkInitialGrid(grid)) {
        alert('Invalid initial grid.');
        return;
    }

    if (await solve(0, 0)) {
        updateBoard();
    } else {
        alert('No solution exists for the given Sudoku.');
    }
}

// Recursive function to solve Sudoku
async function solve(row, col) {
    if (row === 9) {
        return true; // Entire board solved
    }

    // Move to the next cell if current cell is pre-filled
    if (grid[row][col] !== 0) {
        return await solveNextCell(row, col);
    }

    for (let num = 1; num <= 9; num++) {
        if (isValid(grid, row, col, num)) {
            // Visualize current cell
            highlightCell(row, col, 'current');

            // Update grid and wait briefly for visualization
            grid[row][col] = num;
            updateBoard();
            await sleep(2); // Adjust speed of visualization

            // Recursively solve next cell
            if (await solveNextCell(row, col)) {
                return true;
            }

            // Backtrack if solution not found
            grid[row][col] = 0;
            updateBoard();
           
        }
    }

    // No valid number found, backtrack
    return false;
}

// Function to solve next cell
async function solveNextCell(row, col) {
    // Move to the next cell (next column or next row)
    if (col === 8) {
        return await solve(row + 1, 0);
    } else {
        return await solve(row, col + 1);
    }
}

// Function to update the UI after solving Sudoku
function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        cell.value = grid[row][col] !== 0 ? grid[row][col] : '';
        cell.classList.remove('current');
    });
}

// Function to highlight a cell during solving process
function highlightCell(row, col, className) {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const cellRow = parseInt(cell.dataset.row);
        const cellCol = parseInt(cell.dataset.col);
        if (cellRow === row && cellCol === col) {
            cell.classList.add(className);
        } else {
            cell.classList.remove(className);
        }
    });
}

// Function to reset the Sudoku board to default values
function reset() {
    grid = [
        [7, 8, 0, 4, 0, 0, 1, 2, 0],
        [6, 0, 0, 0, 7, 5, 0, 0, 9],
        [0, 0, 0, 6, 0, 1, 0, 7, 8],
        [0, 0, 7, 0, 4, 0, 2, 6, 0],
        [0, 0, 1, 0, 5, 0, 9, 3, 0],
        [9, 0, 4, 0, 6, 0, 0, 0, 5],
        [0, 7, 0, 3, 0, 0, 0, 1, 2],
        [1, 2, 0, 0, 0, 7, 4, 0, 0],
        [0, 4, 9, 2, 0, 6, 0, 0, 7]
    ];
    createBoard();
}

// Function to clear the Sudoku board
function clearBoard() {
    grid = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0));
    createBoard();
}

// Utility function to simulate delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize the board on page load
createBoard();
