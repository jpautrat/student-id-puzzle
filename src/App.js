import { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  // Student ID
  const studentId = '800752772'; // Student ID
  const targetSequence = studentId.slice(0, 8); // Take first 8 digits

  // State for the puzzle tiles (3x3 grid with one empty space)
  const [tiles, setTiles] = useState([]);
  const [emptyIndex, setEmptyIndex] = useState(8); // Last position is empty
  const [isWon, setIsWon] = useState(false);
  const [confetti, setConfetti] = useState([]);

  // Function to get valid moves for the empty space
  const getValidMoves = useCallback((emptyPos) => {
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
  }, []);

  // Function to initialize the puzzle with shuffled numbers
  const initializePuzzle = useCallback(() => {
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
    setConfetti([]);
  }, [getValidMoves, targetSequence]);

  // Initialize the puzzle
  useEffect(() => {
    initializePuzzle();
  }, [initializePuzzle]);

  // Function to handle tile click
  const handleTileClick = (index) => {
    if (isWon) return; // Prevent moves after winning

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
      checkWinCondition(newTiles, index);
    }
  };

  // Function to check if the puzzle is solved
  const checkWinCondition = (currentTiles, newEmptyIndex) => {
    // Create a sequence without the empty space
    const tilesWithoutEmpty = [...currentTiles];
    tilesWithoutEmpty.splice(newEmptyIndex, 1);

    const currentSequence = tilesWithoutEmpty.join('');
    if (currentSequence === targetSequence) {
      setIsWon(true);
      createConfetti();
    }
  };

  // Function to create confetti animation
  const createConfetti = () => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080'];
    const confettiCount = 100;
    const newConfetti = [];

    for (let i = 0; i < confettiCount; i++) {
      newConfetti.push({
        id: i,
        x: Math.random() * 100, // Random horizontal position (0-100%)
        size: Math.random() * 8 + 5, // Random size (5-13px)
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 3 + 2, // Random fall speed
        delay: Math.random() * 2 // Random start delay
      });
    }

    setConfetti(newConfetti);
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Confetti animation */}
        {confetti.map((c) => (
          <div
            key={c.id}
            className="confetti"
            style={{
              left: `${c.x}%`,
              width: `${c.size}px`,
              height: `${c.size}px`,
              backgroundColor: c.color,
              animationDuration: `${c.speed}s`,
              animationDelay: `${c.delay}s`
            }}
          />
        ))}

        <div className="game-container">
          <h1 className="game-title">Student ID Puzzle</h1>
          <div className="target-sequence">
            Target: {targetSequence.split('').join(' ')}
          </div>
          <p className="instructions">
            Click on a tile adjacent to the empty space to move it.
            Arrange the numbers to match your Student ID sequence.
          </p>

          {isWon ? (
            <div className="win-message">
              <h2 className="win-title">Congratulations!</h2>
              <p>You successfully arranged the numbers to match your Student ID!</p>
              <button className="play-again-btn" onClick={initializePuzzle}>
                Play Again
              </button>
            </div>
          ) : (
            <>
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

              <div className="controls">
                <button className="shuffle-btn" onClick={initializePuzzle}>
                  Shuffle
                </button>
              </div>
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
