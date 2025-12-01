import React from 'react';
import Square from './Square';

// PUBLIC_INTERFACE
export default function Board({ squares, onSquareClick, winningLine }) {
  /**
   * Board component for rendering a 3x3 grid.
   *
   * @param {array} squares - Array of 9 items (X/O/null)
   * @param {function} onSquareClick - function to handle square click; will be called only if cell can be clicked
   * @param {array} winningLine - Array of 3 indices for winning cells
   * @returns JSX.Element
   */
  function renderSquare(idx) {
    const highlight = winningLine && winningLine.includes(idx);
    return (
      <Square
        key={idx}
        value={squares[idx]}
        onClick={() => onSquareClick(idx)}
        highlight={highlight}
      />
    );
  }

  // 3 rows of 3
  return (
    <div className="ttt-board">
      {[0, 1, 2].map(row =>
        <div className="ttt-board-row" key={row}>
          {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
        </div>
      )}
    </div>
  );
}
