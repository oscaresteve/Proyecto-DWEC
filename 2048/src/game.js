import Grid from './grid.js';

export default class Game {
  constructor(boardElement) {
    this.boardElement = boardElement;
    this.grid = new Grid(boardElement);
  }

  start() {
    this.grid.addRandomTile();
    this.grid.addRandomTile();
    this.grid.updateDOM();
  }

  handleInput(direction) {
    if (!this.grid.move(direction)) return;
    this.grid.addRandomTile();
    this.grid.updateDOM();

    if (!this.grid.canMove()) {
      alert('¡Juego terminado!');
    }
  }
}
