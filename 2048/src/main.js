import Game from "./components/game.js";

document.addEventListener("DOMContentLoaded", () => {
  //se obtiene el elemto gameBoard y se le pasa al Game, luego se inicia el juego

  const gameBoard = document.getElementById("game-board");
  const game = new Game(gameBoard);
  game.start();

  //Listener para el movimiento, que llama a la funcion de Game

  window.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      game.handleInput(e.key);
    }
  });
});
