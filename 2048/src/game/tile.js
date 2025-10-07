export class Cell {
  constructor(cellElement, x, y) {
    this.cellElement = cellElement;
    this.x = x;
    this.y = y;
    this.tile = null;
  }

  linkTile(tile) {
    this.tile = tile;
    this.tile.setXY(this.x, this.y);
  }
}

export class Tile {
  constructor(boardElement, value = Math.random() > 0.9 ? 4 : 2) {
    this.element = document.createElement('div');
    this.element.classList.add('tile');
    this.value = value;
    this.element.textContent = value;
    boardElement.append(this.element);
  }

  setXY(x, y) {
    this.element.style.setProperty('grid-column-start', x + 1);
    this.element.style.setProperty('grid-row-start', y + 1);
  }
}
