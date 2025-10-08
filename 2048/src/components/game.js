import Grid from "./grid.js";

export default class Game {
  //Constructor que crea un Game con el gameBoard que recibe y un Grid
  constructor(gameBoard) {
    this.gameBoard = gameBoard;
    this.grid = new Grid(gameBoard);
  }

  //Funcion que inicia el juego, añade dos tiles al azar, y actualiza el DOM
  start() {
    this.grid.addRandomTile();
    this.grid.addRandomTile();
    this.grid.updateDOM();
  }

  //Funcion que maneja el input del usuario, mueve los tiles, añade uno nuevo y actualiza el DOM
  handleInput(direction) {
    if (!this.grid.move(direction)) return;
    this.grid.addRandomTile();
    this.grid.updateDOM();

    if (!this.grid.canMove()) {
      alert("¡Juego terminado!");
    }
  }
}
