import Tile from "./tile.js";

export default class Grid {
  constructor(boardElement, size = 8) {
    this.size = size;
    this.cells = Array(size)
      .fill()
      .map(() => Array(size).fill(null));

    this.boardElement = boardElement;
    this.boardElement.style.setProperty("--size", size);
  }

  getEmptyCells() {
    const empty = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (!this.cells[r][c]) empty.push({ r, c });
      }
    }
    return empty;
  }

  addRandomTile() {
    const empty = this.getEmptyCells();
    if (!empty.length) return;

    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    this.cells[r][c] = new Tile(value);
  }

  updateDOM() {
    this.boardElement.innerHTML = "";
    this.cells.forEach((row, r) => {
      row.forEach((tile, c) => {
        const tileDiv = document.createElement("div");
        tileDiv.className = "tile";
        if (tile) {
          tileDiv.textContent = tile.value;
          tileDiv.classList.add(`tile-${tile.value}`);
        }
        this.boardElement.appendChild(tileDiv);
      });
    });
  }

  move(direction) {
    const prev = JSON.stringify(this.cells);
    const merged = Array(this.size)
      .fill()
      .map(() => Array(this.size).fill(false));

    const dir = {
      ArrowUp: { r: -1, c: 0 },
      ArrowDown: { r: 1, c: 0 },
      ArrowLeft: { r: 0, c: -1 },
      ArrowRight: { r: 0, c: 1 },
    }[direction];

    const range = [...Array(this.size).keys()];
    if (dir.r === 1) range.reverse();
    if (dir.c === 1) range.reverse();

    range.forEach((r) => {
      range.forEach((c) => {
        const tile = this.cells[r][c];
        if (!tile) return;

        let nr = r;
        let nc = c;

        while (true) {
          const nextR = nr + dir.r;
          const nextC = nc + dir.c;
          if (
            nextR < 0 ||
            nextR >= this.size ||
            nextC < 0 ||
            nextC >= this.size
          )
            break;

          const nextTile = this.cells[nextR][nextC];
          if (!nextTile) {
            this.cells[nextR][nextC] = tile;
            this.cells[nr][nc] = null;
            nr = nextR;
            nc = nextC;
          } else if (nextTile.value === tile.value && !merged[nextR][nextC]) {
            this.cells[nextR][nextC].value *= 2;
            this.cells[nr][nc] = null;
            merged[nextR][nextC] = true;
            break;
          } else {
            break;
          }
        }
      });
    });

    return JSON.stringify(this.cells) !== prev;
  }

  canMove() {
    if (this.getEmptyCells().length) return true;
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const tile = this.cells[r][c];
        if (
          (r < this.size - 1 && this.cells[r + 1][c]?.value === tile.value) ||
          (c < this.size - 1 && this.cells[r][c + 1]?.value === tile.value)
        ) {
          return true;
        }
      }
    }
    return false;
  }
}
