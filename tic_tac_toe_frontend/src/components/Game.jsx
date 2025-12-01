import React, { useState, useEffect } from 'react';
import Board from './Board';

/**
 * Check for win/tie - returns winner, winning line indices, or null if game ongoing.
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
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

/**
 * Returns available moves.
 */
function getAvailableMoves(squares) {
  return squares.map((val, idx) => val == null ? idx : null).filter(idx => idx !== null);
}

// Simple minimax AI for unbeatable play or fallback to simple heuristics for smaller boards
function getBestAIMove(squares, aiMark, playerMark) {
  // Minimax with scores: Win (+1), Draw (0), Lose (-1)
  function minimax(board, isMaximizing) {
    const result = calculateWinner(board);
    if (result.winner === aiMark) return { score: 1 };
    if (result.winner === playerMark) return { score: -1 };
    if (board.every(x => x != null)) return { score: 0 };

    const moves = getAvailableMoves(board);
    let bestScore = isMaximizing ? -Infinity : Infinity;
    let bestMove = null;
    for (let move of moves) {
      const nextBoard = board.slice();
      nextBoard[move] = isMaximizing ? aiMark : playerMark;
      const { score } = minimax(nextBoard, !isMaximizing);
      if (isMaximizing) {
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      } else {
        if (score < bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
    }
    return { score: bestScore, move: bestMove };
  }

  // If less than 7 moves, minimax is fast; otherwise, fallback to random:
  const emptyCount = getAvailableMoves(squares).length;
  if (emptyCount >= 7) {
    // First/second move: center, then corners, then sides
    if (squares[4] == null) return 4;
    const corners = [0, 2, 6, 8].filter(i => squares[i] == null);
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
    const sides = [1, 3, 5, 7].filter(i => squares[i] == null);
    if (sides.length > 0) return sides[Math.floor(Math.random() * sides.length)];
    // Otherwise pick random
    return getAvailableMoves(squares)[0];
  } else {
    // Use minimax for 4 or fewer empty squares
    return minimax(squares, true).move;
  }
}

// PUBLIC_INTERFACE
export default function Game() {
  /**
   * Game component for Tic Tac Toe.
   * Supports PvP and Player vs AI, tracks full game state, and orchestrates AI moves.
   */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [mode, setMode] = useState('pvp'); // "pvp" or "ai"
  const [aiMark, setAIMark] = useState('O'); // AI always O, user first as X
  const [isAITurning, setIsAITurning] = useState(false);

  const { winner, line: winningLine } = calculateWinner(squares);
  const moveCount = squares.filter(Boolean).length;
  const isDraw = !winner && moveCount === 9;

  // Indicates who's turn (AI or Players)
  const turnDisplay = mode === 'ai'
    ? (winner ? '' : (xIsNext ? 'Player (X)' : aiMark === 'X' ? 'AI (X)' : 'AI (O)'))
    : (xIsNext ? 'Player X' : 'Player O');

  // Decide if user can click (block while AI is moving, after win, or after full board)
  function canPlayerMove(idx) {
    if (winner || isDraw) return false;
    if (mode === 'ai') {
      // Player is X, AI is O
      if (isAITurning) return false;
      if (!xIsNext) return false; // Only allow X (user) to click on their turn
    }
    return squares[idx] == null;
  }

  // PUBLIC_INTERFACE
  function handleSquareClick(idx) {
    if (!canPlayerMove(idx)) return;
    const next = squares.slice();
    next[idx] = xIsNext ? 'X' : 'O';
    setSquares(next);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setIsAITurning(false);
  }

  // PUBLIC_INTERFACE
  function handleModeChange(e) {
    const val = e.target.value;
    setMode(val);
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setIsAITurning(false);
    // If switching to AI and AI is X, trigger AI move
  }

  // AI effect: If it's AI's turn in player-vs-AI, make a move automatically
  useEffect(() => {
    if (mode === 'ai' && !winner && !isDraw && !xIsNext) {
      setIsAITurning(true);
      // Minor delay for realism/UI polish
      const tm = setTimeout(() => {
        const move = getBestAIMove(squares, aiMark, aiMark === 'X' ? 'O' : 'X');
        if (move !== undefined && squares[move] == null) {
          const next = squares.slice();
          next[move] = 'O';
          setSquares(next);
          setXIsNext(true); // always revert to player
        }
        setIsAITurning(false);
      }, 500);
      return () => clearTimeout(tm);
    }
  }, [mode, squares, xIsNext, aiMark, winner, isDraw]);

  // Status bar: winner/draw/turn/AI
  let status;
  if (winner) {
    status = (
      <span>
        <span className="ttt-status-winner">{winner === aiMark && mode === 'ai' ? 'AI' : winner}</span> wins!
      </span>
    );
  } else if (isDraw) {
    status = <span>It's a <span className="ttt-status-draw">draw</span>!</span>;
  } else {
    status = (
      <span>
        Turn: <span className="ttt-status-turn">
          {mode === 'ai'
            ? (xIsNext ? 'Player (X)' : 'AI (O)')
            : (xIsNext ? 'X' : 'O')}
        </span>
      </span>
    );
  }

  // Styling for selected mode button
  const modeBtnClass = (val) =>
    `ttt-mode-btn${mode === val ? ' selected' : ''}`;

  // UI rendering
  return (
    <div className="ttt-game-outer">
      <h1 className="ttt-title">Tic Tac Toe</h1>
      <div className="ttt-gradient-bg">
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 15,
        }}>
          <button
            className={modeBtnClass('pvp')}
            style={{
              background: mode === 'pvp' ? 'var(--primary)' : 'var(--surface)',
              color: mode === 'pvp' ? '#fff' : 'var(--primary)',
              border: mode === 'pvp' ? 'none' : '2px solid var(--primary)',
              borderRadius: 10,
              fontWeight: 600,
              padding: '8px 18px',
              fontSize: '1rem',
              boxShadow: mode === 'pvp' ? '0 1px 6px #2563eb21' : undefined,
              cursor: mode === 'pvp' ? 'default' : 'pointer',
              opacity: mode === 'pvp' ? 1 : 0.91,
              outline: 'none',
              transition: 'all .16s cubic-bezier(.4,2,.4,1)'
            }}
            onClick={mode === 'pvp' ? undefined : () => handleModeChange({ target: { value: 'pvp' } })}
            aria-pressed={mode === 'pvp'}
          >
            Player vs Player
          </button>
          <button
            className={modeBtnClass('ai')}
            style={{
              background: mode === 'ai' ? 'var(--secondary)' : 'var(--surface)',
              color: mode === 'ai' ? '#fff' : 'var(--secondary)',
              border: mode === 'ai' ? 'none' : '2px solid var(--secondary)',
              borderRadius: 10,
              fontWeight: 600,
              padding: '8px 18px',
              fontSize: '1rem',
              boxShadow: mode === 'ai' ? '0 1px 6px #f59e0b17' : undefined,
              cursor: mode === 'ai' ? 'default' : 'pointer',
              opacity: mode === 'ai' ? 1 : 0.91,
              outline: 'none',
              transition: 'all .16s cubic-bezier(.4,2,.4,1)'
            }}
            onClick={mode === 'ai' ? undefined : () => handleModeChange({ target: { value: 'ai' } })}
            aria-pressed={mode === 'ai'}
          >
            Player vs AI
          </button>
        </div>
        <div className="ttt-game-box">
          <Board
            squares={squares}
            // disables clicks on non-moveable squares
            onSquareClick={idx => canPlayerMove(idx) && handleSquareClick(idx)}
            winningLine={winningLine}
          />
          <div className="ttt-status-area">
            <div className="ttt-status">{status}</div>
            <button className="ttt-restart-btn" onClick={handleRestart} disabled={moveCount === 0 && mode === 'pvp'}>
              Restart
            </button>
            {mode === 'ai' && !winner && !isDraw && (
              <div style={{
                marginTop: 6, color: '#9ca3af', fontSize: '0.99rem', minHeight: 22
              }}>
                {isAITurning ? <span>AI is thinking...</span> : <span>{xIsNext ? 'Your move.' : 'AI\'s move.'}</span>}
              </div>
            )}
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
