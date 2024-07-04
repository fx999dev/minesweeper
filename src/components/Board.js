import React from "react";
import Cell from "./Cell";

const Board = ({ board, onClick, onContextMenu }) => {
  const size = board.length;

  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${size}, 30px)`,
        gridTemplateRows: `repeat(${size}, 30px)`,
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            onClick={() => onClick(rowIndex, colIndex)}
            onContextMenu={(e) => onContextMenu(e, rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
};

export default Board;
