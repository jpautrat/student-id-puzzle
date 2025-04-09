import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Student ID - replace with your own ID
  const studentId = '801321666'; // Example student ID
  const targetSequence = studentId.slice(0, 8); // Take first 8 digits

  // State for the puzzle tiles
  const [tiles, setTiles] = useState([]);
  const [isWon, setIsWon] = useState(false);

  // Initialize the puzzle
  useEffect(() => {
    initializePuzzle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to initialize the puzzle with shuffled numbers
  const initializePuzzle = () => {
    const numbers = targetSequence.split('').map(num => parseInt(num));
    const shuffled = [...numbers].sort(() => Math.random() - 0.5);

    setTiles(shuffled);
    setIsWon(false);
  };

  // Function to handle tile click
  const handleTileClick = (index) => {
    // Create a copy of the current tiles
    const newTiles = [...tiles];

    // Get the positions of adjacent tiles (considering a 3x3 grid layout)
    const row = Math.floor(index / 3);
    const col = index % 3;

    // Check all four possible adjacent positions (up, right, down, left)
    const adjacentPositions = [
      { row: row - 1, col: col },     // up
      { row: row, col: col + 1 },     // right
      { row: row + 1, col: col },     // down
      { row: row, col: col - 1 }      // left
    ];

    // Find a valid adjacent position to swap with
    for (const pos of adjacentPositions) {
      if (pos.row >= 0 && pos.row < 3 && pos.col >= 0 && pos.col < 3) {
        const adjacentIndex = pos.row * 3 + pos.col;

        // Swap the tiles
        [newTiles[index], newTiles[adjacentIndex]] = [newTiles[adjacentIndex], newTiles[index]];

        // Update the state
        setTiles(newTiles);

        // Check if the puzzle is solved
        checkWinCondition(newTiles);

        // Exit after the first swap
        break;
      }
    }
  };

  // Function to check if the puzzle is solved
  const checkWinCondition = (currentTiles) => {
    const currentSequence = currentTiles.join('');
    if (currentSequence === targetSequence) {
      setIsWon(true);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Student ID Puzzle</h1>
        <p>Arrange the numbers to match your Student ID: {targetSequence}</p>

        {isWon ? (
          <div className="win-message">
            <h2>Congratulations! You won!</h2>
            <button onClick={initializePuzzle}>Play Again</button>
          </div>
        ) : (
          <div className="puzzle-board">
            {tiles.map((tile, index) => (
              <div
                key={index}
                className="puzzle-tile"
                onClick={() => handleTileClick(index)}
              >
                {tile}
              </div>
            ))}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
