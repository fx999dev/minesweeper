import React, { useState, useEffect } from "react";
import Board from "../components/Board";
import DifficultySelector from "../components/DifficultySelector";

const createEmptyBoard = (size) => {
  let board = [];
  for (let i = 0; i < size; i++) {
    let row = [];
    for (let j = 0; j < size; j++) {
      row.push({
        isRevealed: false,
        isMine: false,
        isFlagged: false,
        neighborMines: 0,
      });
    }
    board.push(row);
  }
  return board;
};

const plantMines = (board, mines) => {
  let plantedMines = 0;
  while (plantedMines < mines) {
    const row = Math.floor(Math.random() * board.length);
    const col = Math.floor(Math.random() * board[0].length);
    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      plantedMines++;
    }
  }
};

const calculateNeighborMines = (board) => {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      if (!board[row][col].isMine) {
        let mines = 0;
        directions.forEach(([dRow, dCol]) => {
          const newRow = row + dRow;
          const newCol = col + dCol;
          if (
            newRow >= 0 &&
            newRow < board.length &&
            newCol >= 0 &&
            newCol < board[0].length &&
            board[newRow][newCol].isMine
          ) {
            mines++;
          }
        });
        board[row][col].neighborMines = mines;
      }
    }
  }
};

// Reveals a cell at the specified row and column. If the cell has no neighboring mines, it recursively reveals adjacent cells.
const revealCell = (board, row, col) => {
  // Base case: Do not reveal if the cell is already revealed or flagged.
  if (board[row][col].isRevealed || board[row][col].isFlagged) return;

  // Mark the cell as revealed.
  board[row][col].isRevealed = true;

  // If the cell has no neighboring mines and is not a mine, recursively reveal adjacent cells.
  if (board[row][col].neighborMines === 0 && !board[row][col].isMine) {
    revealAdjacentCells(board, row, col);
  }
};

// Recursively reveals adjacent cells for a cell with no neighboring mines.
const revealAdjacentCells = (board, row, col) => {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  directions.forEach(([dRow, dCol]) => {
    const newRow = row + dRow;
    const newCol = col + dCol;
    // Check if the new position is within the board boundaries.
    if (
      newRow >= 0 &&
      newRow < board.length &&
      newCol >= 0 &&
      newCol < board[0].length
    ) {
      // Recursively reveal the cell if it's not already revealed.
      revealCell(board, newRow, newCol);
    }
  });
};

const checkWinCondition = (board, mines) => {
  let revealedCount = 0;
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      if (board[row][col].isRevealed) {
        revealedCount++;
      }
    }
  }
  return revealedCount === board.length * board.length - mines;
};

const Game = () => {
  const [difficulty, setDifficulty] = useState(null);
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [topScores, setTopScores] = useState([]);

  useEffect(() => {
    if (difficulty) {
      let size, mines;
      switch (difficulty) {
        case "easy":
          size = 8;
          mines = 10;
          break;
        case "medium":
          size = 12;
          mines = 20;
          break;
        case "hard":
          size = 16;
          mines = 40;
          break;
        default:
          break;
      }
      const newBoard = createEmptyBoard(size);
      plantMines(newBoard, mines);
      calculateNeighborMines(newBoard);
      setBoard(newBoard);
      setGameOver(false);
      setGameWon(false);
    }
  }, [difficulty]);

  const handleClick = (row, col) => {
    if (gameOver || gameWon) return;

    const newBoard = [...board];
    revealCell(newBoard, row, col);

    if (newBoard[row][col].isMine) {
      setGameOver(true);
      alert("Game Over!");
    } else if (
      checkWinCondition(
        newBoard,
        difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 40
      )
    ) {
      setGameWon(true);
      const name = prompt("You won! Enter your name:");
      setTopScores([...topScores, { name, difficulty }]);
      alert("You won!");
    }

    setBoard(newBoard);
  };

  const handleContextMenu = (e, row, col) => {
    e.preventDefault();
    if (gameOver || gameWon) return;

    const newBoard = [...board];
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
  };

  if (!difficulty) {
    return <DifficultySelector setDifficulty={setDifficulty} />;
  }

  return (
    <div className="game">
      <h1>Minesweeper</h1>
      <div className="game-container">
        <div className="top-scores">
          <h2>Top Scores</h2>
          <ul>
            {topScores.map((score, index) => (
              <li key={index}>
                {score.name} - {score.difficulty}
              </li>
            ))}
          </ul>
        </div>
        <Board
          board={board}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
        />
      </div>
      {(gameOver || gameWon) && (
        <button onClick={() => setDifficulty(null)}>Neues Spiel</button>
      )}
    </div>
  );
};

export default Game;
