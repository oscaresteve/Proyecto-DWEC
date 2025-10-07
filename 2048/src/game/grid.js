import { Cell } from './tile.js';

export class Grid {
  constructor(boardElement) {
    this.cells = [];
    for (let i = 0; i < 16; i++) {
      const cell = document.createElement('div');
      cell.classList.add('tile');
      boardElement.append(cell);
      this.cells.push(new Cell(cell, i % 4, Math.floor(i / 4)));
    }
  }

  get emptyCells() {
    return this.cells.filter(c => c.tile == null);
  }

  randomEmptyCell() {
    const empties = this.emptyCells;
    if (empties.length === 0) return null;
    return empties[Math.floor(Math.random() * empties.length)];
  }
}
