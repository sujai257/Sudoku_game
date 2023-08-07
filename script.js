
function createSudokuGrid() {
  const gridContainer = document.querySelector(".grid-container");
  const grid = generateSudokuGrid();
  grid.forEach((row, rowIndex) => {
    row.forEach((cellValue, colIndex) => {
      const gridItem = document.createElement("input");
      gridItem.classList.add("grid-item");
      gridItem.type = "text";
      gridItem.maxLength = 1;
      gridItem.value = cellValue === 0 ? "" : cellValue;
      gridItem.setAttribute("data-row", rowIndex);
      gridItem.setAttribute("data-col", colIndex);
      if (cellValue !== 0) {
        gridItem.setAttribute("data-question", true);
        gridItem.readOnly = true; // Make the question cells read-only
      }
      gridContainer.appendChild(gridItem);
      gridItem.addEventListener("input", handleCellInput);
    });
  });
}

function handleCellInput(event) {
  const inputValue = parseInt(event.target.value);
  const isValidInput = !isNaN(inputValue) && inputValue >= 1 && inputValue <= 9;

  if (!isValidInput) {
    event.target.value = "";
  }
  // check();
}

function check() {
  const gridItems = document.querySelectorAll(".grid-item");

  gridItems.forEach((gridItem) => {
    const rowIndex = parseInt(gridItem.getAttribute("data-row"));
    const colIndex = parseInt(gridItem.getAttribute("data-col"));
    const inputValue = parseInt(gridItem.value);
    gridItem.classList.remove("correct", "wrong");
    if (isNaN(inputValue) || inputValue < 1 || inputValue > 9) {
      return;
    }
    for (let i = 0; i < 9; i++) {
      if (
        i !== colIndex &&
        gridItems[rowIndex * 9 + i].value === gridItem.value
      ) {
        gridItem.classList.add("wrong");
        return;
      }
      if (
        i !== rowIndex &&
        gridItems[i * 9 + colIndex].value === gridItem.value
      ) {
        gridItem.classList.add("wrong");
        return;
      }
    }
    const startRow = Math.floor(rowIndex / 3) * 3;
    const startCol = Math.floor(colIndex / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cellValue = gridItems[(startRow + i) * 9 + startCol + j].value;
        if (
          (startRow + i !== rowIndex || startCol + j !== colIndex) &&
          cellValue === gridItem.value
        ) {
          gridItem.classList.add("wrong");
          return;
        }
      }
    }
    gridItem.classList.add("correct");
  });

  setTimeout(() => {
    gridItems.forEach((gridItem) => {
      gridItem.classList.remove("correct", "wrong");
    });
  }, 5000); 
}

function reset() {
  const gridItems = document.querySelectorAll(".grid-item");

  gridItems.forEach((gridItem) => {
    if (!gridItem.hasAttribute("data-question")) {
      gridItem.value = "";
      gridItem.classList.remove("correct", "wrong");
    }
  });
}
function generateNew() {
  const gridContainer = document.querySelector(".grid-container");
  gridContainer.innerHTML = "";
  createSudokuGrid(); 
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
function generateSudokuGrid() {
  const size = 9;
  const grid = Array.from({ length: size }, () => Array(size).fill(0));
  function isValidPlacement(row, col, num) {
    for (let i = 0; i < size; i++) {
      if (grid[row][i] === num || grid[i][col] === num) {
        return false;
      }
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[startRow + i][startCol + j] === num) {
          return false;
        }
      }
    }

    return true;
  }

  // Helper function to solve the Sudoku using backtracking
  function solveSudoku() {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (grid[row][col] === 0) {
          const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          shuffleArray(numbers);

          for (const num of numbers) {
            if (isValidPlacement(row, col, num)) {
              grid[row][col] = num;
              if (solveSudoku()) {
                return true;
              }
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  // Generate a random starting configuration by solving a completely empty grid
  solveSudoku();

  // Clone the solved grid to create a new instance
  const clonedGrid = grid.map((row) => row.slice());

  // Remove some numbers to create the puzzle (question)
  const numToRemove = 40; // Adjust this number to control the number of cells filled
  let count = 0;
  while (count < numToRemove) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    if (clonedGrid[row][col] !== 0) {
      clonedGrid[row][col] = 0;
      count++;
    }
  }

  return clonedGrid;
}

function solveSudokuAutomatically(grid) {
  const size = 9;
  function isValidPlacement(row, col, num) {
    for (let i = 0; i < size; i++) {
      if (grid[row][i] === num || grid[i][col] === num) {
        return false;
      }
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[startRow + i][startCol + j] === num) {
          return false;
        }
      }
    }
    return true;
  }
  function solve() {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(row, col, num)) {
              grid[row][col] = num;
              if (solve()) {
                return true;
              }
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  if (solve()) {
    return grid; 
  } else {
    return null; 
  }
}
function solve() {
  const gridItems = document.querySelectorAll(".grid-item");
  const grid = [];
  for (let row = 0; row < 9; row++) {
    grid.push([]);
    for (let col = 0; col < 9; col++) {
      const gridItem = gridItems[row * 9 + col];
      grid[row].push(parseInt(gridItem.value) || 0);
    }
  }
  const solvedGrid = solveSudokuAutomatically(grid);
  if (solvedGrid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const gridItem = gridItems[row * 9 + col];
        gridItem.value = solvedGrid[row][col];
      }
    }
  } else {
    alert("No solution found for the current puzzle.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  createSudokuGrid();
  const checkButton = document.querySelector(".btn-primary");
  const resetButton = document.querySelector(".btn-secondary");
  const newGameButton = document.querySelector(".btn-success");

  checkButton.addEventListener("click", check);
  resetButton.addEventListener("click", reset);
  newGameButton.addEventListener("click", generateNew);
});
