import Tile from "./tile.js";

export default class Grid {
  constructor(gameBoard, size = 5) {
    this.size = size;

    // Array bidimensional lleno de nulls
    this.cells = Array(size)
      .fill()
      .map(() => Array(size).fill(null));

    this.gameBoard = gameBoard;

    // Puntuación total acumulada (se incrementa solo en fusiones)
    this.score = 0;

    // Pasar el tamaño del tablero a los estilos
    this.gameBoard.style.setProperty("--size", size);
  }

  // Devuelve un array con las posiciones de las celdas vacias
  getEmptyCells() {
    const empty = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (!this.cells[r][c]) empty.push({ r, c });
      }
    }
    return empty;
  }

  // Devuelve la puntuación acumulada
  getScore() {
    return this.score;
  }

  // Añade un tile aleatoriamente en una celda vacia
  addRandomTile() {
    const empty = this.getEmptyCells();
    if (!empty.length) return;

    const { r, c } = empty[Math.floor(Math.random() * empty.length)];

    // Se calcula el valor del tile con probabilidades, 2 o 4
    const value = Math.random() < 0.9 ? 2 : 4;

    // Se crea el tile y se añade a la celda
    this.cells[r][c] = new Tile(value);
  }

  // Actualiza el DOM para que se muestren los cambios
  updateDOM() {
    // Se limpia el HTML
    this.gameBoard.innerHTML = "";

    this.cells.forEach((row, r) => {
      row.forEach((tile, c) => {
        // Se crea un elemento div para cada celda y se le añade la clase tile
        const tileDiv = document.createElement("div");
        tileDiv.className = "tile";

        // Si la celda contiene un tile, se le añade valor y se le añade otra clase correspondiente
        if (tile) {
          tileDiv.textContent = tile.value;
          tileDiv.classList.add(`tile-${tile.value}`);
        }
        this.gameBoard.appendChild(tileDiv);
      });
    });

    // Se actualiza la puntuación (ahora acumulada)
    const scoreElement = document.getElementById("score");
    if (scoreElement) scoreElement.textContent = this.getScore();
  }

  move(direction) {
    // Estado inicial del tablero en JSON
    const prev = JSON.stringify(this.cells, (key, value) => {
      // para que JSON.stringify incluya el valor de Tile (si Tile es objeto),
      // devolvemos value.value si es un Tile, así la comparación funciona mejor.
      if (value && typeof value === "object" && "value" in value) {
        return { value: value.value };
      }
      return value;
    });

    // Array bidimensional lleno de false
    // Se usa para no combinar dos veces un tile
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
    // Para recorrer en el orden correcto según la dirección
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
            // Realizamos la fusión: doblamos el valor en la celda de destino
            this.cells[nextR][nextC].value *= 2;
            // Incrementamos la puntuación acumulada con el valor resultante
            this.score += this.cells[nextR][nextC].value;
            this.cells[nr][nc] = null;
            merged[nextR][nextC] = true;
            break;
          } else {
            break;
          }
        }
      });
    });

    return JSON.stringify(this.cells, (key, value) => {
      if (value && typeof value === "object" && "value" in value) {
        return { value: value.value };
      }
      return value;
    }) !== prev;
  }

  canMove() {
    if (this.getEmptyCells().length) return true;
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const tile = this.cells[r][c];
        // Si existe una casilla adyacente con el mismo valor, se puede mover (fusionar)
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
