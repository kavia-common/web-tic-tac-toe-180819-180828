import React, { useState } from 'react';
import Board from './Board';

// Helper to check for win
function calculateWinner(squares) {
  // index triples for win lines
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }
  return { winner: null, line: null };
}

// PUBLIC_INTERFACE
export default function Game() {
  /**
   * Game component for Tic Tac Toe.
   *
   * Manages full game state and user interactions.
   */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const { winner, line: winningLine } = calculateWinner(squares);

  const moveCount = squares.filter(Boolean).length;
  const isDraw = !winner && moveCount === 9;

  // PUBLIC_INTERFACE
  function handleSquareClick(idx) {
    if (squares[idx] || winner) return;
    const next = squares.slice();
    next[idx] = xIsNext ? 'X' : 'O';
    setSquares(next);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  let status;
  if (winner) {
    status = (
      <span>
        <span className="ttt-status-winner">{winner}</span> wins!
      </span>
    );
  } else if (isDraw) {
    status = <span>It's a <span className="ttt-status-draw">draw</span>!</span>;
  } else {
    status = (
      <span>
        Turn: <span className="ttt-status-turn">{xIsNext ? 'X' : 'O'}</span>
      </span>
    );
  }

  return (
    <div className="ttt-game-outer">
      <h1 className="ttt-title">Tic Tac Toe</h1>
      <div className="ttt-gradient-bg">
        <div className="ttt-game-box">
          <Board
            squares={squares}
            onSquareClick={handleSquareClick}
            winningLine={winningLine}
          />
          <div className="ttt-status-area">
            <div className="ttt-status">{status}</div>
            <button className="ttt-restart-btn" onClick={handleRestart}>
              Restart
            </button>
          </div>
        </div>
      </div>
      <div className="ttt-footer">
        <small>
          Ocean Professional Theme &bull; Powered by React
        </small>
      </div>
    </div>
  );
}
