import React from 'react';

// PUBLIC_INTERFACE
export default function Square({ value, onClick, highlight }) {
  /**
   * Square component for the Tic Tac Toe game.
   *
   * @param {string|null} value - 'X', 'O', or null for empty
   * @param {function} onClick - click handler
   * @param {boolean} highlight - whether to highlight the square (for win)
   * @returns JSX.Element
   */
  return (
    <button
      className={`ttt-square${highlight ? ' highlight' : ''}`}
      onClick={onClick}
      aria-label={value ? `Cell: ${value}` : 'Empty cell'}
      tabIndex={0}
      type="button"
    >
      {value}
    </button>
  );
}
