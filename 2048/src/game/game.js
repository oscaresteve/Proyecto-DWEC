import { Grid } from './grid.js';
import { Tile } from './tile.js';

export function setupGame() {
  const board = document.getElementById('game-board');
  const grid = new Grid(board);

  grid.randomEmptyCell().linkTile(new Tile(board));
  grid.randomEmptyCell().linkTile(new Tile(board));

  setupInputOnce(grid);
}

function setupInputOnce(grid) {
  window.addEventListener('keydown', async (e) => {
    switch (e.key) {
      case 'ArrowUp':
        if (!grid.canMoveUp()) return setupInputOnce(grid);
        await grid.moveUp();
        break;
      case 'ArrowDown':
        if (!grid.canMoveDown()) return setupInputOnce(grid);
        await grid.moveDown();
        break;
      case 'ArrowLeft':
        if (!grid.canMoveLeft()) return setupInputOnce(grid);
        await grid.moveLeft();
        break;
      case 'ArrowRight':
        if (!grid.canMoveRight()) return setupInputOnce(grid);
        await grid.moveRight();
        break;
      default:
        return setupInputOnce(grid);
    }

    grid.randomEmptyCell()?.linkTile(new Tile(document.getElementById('game-board')));
    setupInputOnce(grid);
  }, { once: true });
}
