import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Student ID
  const studentId = '800752772'; // Student ID
  const targetSequence = studentId.slice(0, 8); // Take first 8 digits

  // State for the puzzle tiles (3x3 grid with one empty space)
  const [tiles, setTiles] = useState([]);
  const [emptyIndex, setEmptyIndex] = useState(8); // Last position is empty
  const [isWon, setIsWon] = useState(false);

  // Initialize the puzzle
  useEffect(() => {
    initializePuzzle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to initialize the puzzle with shuffled numbers
  const initializePuzzle = () => {
    // Create an array with the target sequence digits and a null for the empty space
    const numbers = targetSequence.split('').map(num => parseInt(num));
    numbers.push(null); // Add empty space

    // Create a solvable puzzle by making random valid moves
    let currentTiles = [...numbers];
    let currentEmptyIndex = 8; // Start with empty at the bottom right

    // Make a series of random valid moves to shuffle
    for (let i = 0; i < 100; i++) { // 100 random moves should be enough
      const validMoves = getValidMoves(currentEmptyIndex);
      const randomMoveIndex = Math.floor(Math.random() * validMoves.length);
      const tileToMove = validMoves[randomMoveIndex];

      // Swap the empty space with the selected tile
      [currentTiles[currentEmptyIndex], currentTiles[tileToMove]] =
        [currentTiles[tileToMove], currentTiles[currentEmptyIndex]];

      currentEmptyIndex = tileToMove;
    }

    setTiles(currentTiles);
    setEmptyIndex(currentEmptyIndex);
    setIsWon(false);
  };

  // Function to get valid moves for the empty space
  const getValidMoves = (emptyPos) => {
    const row = Math.floor(emptyPos / 3);
    const col = emptyPos % 3;
    const validMoves = [];

    // Check all four possible adjacent positions (up, right, down, left)
    const adjacentPositions = [
      { row: row - 1, col: col },     // up
      { row: row, col: col + 1 },     // right
      { row: row + 1, col: col },     // down
      { row: row, col: col - 1 }      // left
    ];

    // Find valid adjacent positions
    for (const pos of adjacentPositions) {
      if (pos.row >= 0 && pos.row < 3 && pos.col >= 0 && pos.col < 3) {
        validMoves.push(pos.row * 3 + pos.col);
      }
    }

    return validMoves;
  };

  // Function to handle tile click
  const handleTileClick = (index) => {
    // Only allow moving tiles adjacent to the empty space
    const validMoves = getValidMoves(emptyIndex);

    if (validMoves.includes(index)) {
      // Create a copy of the current tiles
      const newTiles = [...tiles];

      // Swap the clicked tile with the empty space
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];

      // Update the state
      setTiles(newTiles);
      setEmptyIndex(index);

      // Check if the puzzle is solved
      checkWinCondition(newTiles);
    }
  };

  // Function to check if the puzzle is solved
  const checkWinCondition = (currentTiles) => {
    // Create a sequence without the empty space
    const tilesWithoutEmpty = [...currentTiles];
    tilesWithoutEmpty.splice(emptyIndex, 1);

    const currentSequence = tilesWithoutEmpty.join('');
    if (currentSequence === targetSequence) {
      setIsWon(true);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Student ID Puzzle</h1>
        <p>Arrange the numbers to match your Student ID: {targetSequence}</p>
        <p className="instructions">Click on a tile adjacent to the empty space to move it.</p>

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
                className={`puzzle-tile ${tile === null ? 'empty' : ''}`}
                onClick={() => tile !== null && handleTileClick(index)}
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
