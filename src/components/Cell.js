import React from "react";

const Cell = ({ cell, onClick, onContextMenu }) => {
  let content = "";

  if (cell.isRevealed) {
    content = cell.isMine ? "💣" : cell.neighborMines || "";
  } else if (cell.isFlagged) {
    content = "🚩";
  }

  return (
    <div
      className={`cell ${cell.isRevealed ? "revealed" : ""}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {content}
    </div>
  );
};

export default Cell;
