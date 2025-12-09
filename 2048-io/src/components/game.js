import { createGrid, addRandomTile, moveGrid, canMove } from "./grid.js";

// estado inicial del juego
export function createGameState(size = 5) {
  let grid = createGrid(size);
  grid = addRandomTile(grid);
  grid = addRandomTile(grid);

  return {
    size,
    score: 0,
    grid,
  };
}

// mover en una direccion
export function applyMove(gameState, direction) {
  const {
    moved,
    grid: movedGrid,
    gained,
  } = moveGrid(gameState.grid, direction);

  if (!moved) return gameState;

  let newGrid = movedGrid;
  newGrid = addRandomTile(newGrid);

  const newState = {
    ...gameState,
    grid: newGrid,
    score: gameState.score + gained,
  };

  return newState;
}

// comprobar si se pueden hacer mas movimientos
export function isGameOver(gameState) {
  return !canMove(gameState.grid);
}
