import Tile from "./tile.js";

export default class Grid {
  constructor(gameBoard, size = 5) {
    this.size = size;

    //Array bidimensional lleno de nulls
    this.cells = Array(size)
      .fill()
      .map(() => Array(size).fill(null));

    this.gameBoard = gameBoard;

    //Pasar el tamaño del tablero a los estilos
    this.gameBoard.style.setProperty("--size", size);
  }

  //Devuelve un array con las posiciones de las celdas vacias
  getEmptyCells() {
    const empty = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (!this.cells[r][c]) empty.push({ r, c });
      }
    }
    return empty;
  }

  //Calcula la puntuacion del juego
  getScore() {
    let score = 0;

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const tile = this.cells[r][c];
        if (tile) score += tile.value;
      }
    }
    return score;
  }

  //Añade un tile aleatoriamente en una celda vacia
  addRandomTile() {
    const empty = this.getEmptyCells();
    if (!empty.length) return;

    const { r, c } = empty[Math.floor(Math.random() * empty.length)];

    //Se calcula el valor del tile con probabilidades, 2 o 4
    const value = Math.random() < 0.9 ? 2 : 4;

    //Se crea el tile y se añade a la celda
    this.cells[r][c] = new Tile(value);
  }

  //Actualiza el DOM para que se muestren los cambios
  updateDOM() {
    //Se limpia el HTML
    this.gameBoard.innerHTML = "";

    this.cells.forEach((row, r) => {
      row.forEach((tile, c) => {
        //Se crea un elemento div para cada celda y se le añade la clase tile
        const tileDiv = document.createElement("div");
        tileDiv.className = "tile";

        //Si la celda contiene un tile, se le añade valor y se le añade otra clase corresponidente
        if (tile) {
          tileDiv.textContent = tile.value;
          tileDiv.classList.add(`tile-${tile.value}`);
        }
        this.gameBoard.appendChild(tileDiv);
      });
    });

    //Se actualiza la puntuacion
    const scoreElement = document.getElementById("score");
    scoreElement.textContent = this.getScore();
    
  }

  move(direction) {
    //Estado inicial del tablero en JSON
    const prev = JSON.stringify(this.cells);

    //Array bidimensional lleno de false
    //Se usa para no combinar dos veces un tile
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
