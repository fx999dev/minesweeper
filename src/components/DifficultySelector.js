import React from "react";

const DifficultySelector = ({ setDifficulty }) => {
  return (
    <div className="difficulty-selector">
      <h2>Wähle die Schwierigkeit:</h2>
      <button onClick={() => setDifficulty("easy")}>Leicht</button>
      <button onClick={() => setDifficulty("medium")}>Mittel</button>
      <button onClick={() => setDifficulty("hard")}>Schwer</button>
    </div>
  );
};

export default DifficultySelector;
