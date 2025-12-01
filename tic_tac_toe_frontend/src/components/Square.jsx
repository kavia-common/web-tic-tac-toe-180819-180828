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
  // Disabled if value present
  return (
    <button
      className={`ttt-square${highlight ? ' highlight' : ''}`}
      onClick={value == null ? onClick : undefined}
      aria-label={value ? `Cell: ${value}` : 'Empty cell'}
      tabIndex={0}
      type="button"
      disabled={!!value}
      style={{
        cursor: value == null ? 'pointer' : 'not-allowed',
        opacity: value == null ? 1 : 0.58,
        userSelect: value == null ? 'auto' : 'none'
      }}
    >
      {value}
    </button>
  );
}
