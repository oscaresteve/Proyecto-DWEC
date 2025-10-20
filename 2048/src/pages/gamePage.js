import Game from "../components/game.js";

export default class GamePage {
  constructor(container, router) {
    this.container = container;
    this.router = router;
  }

  render() {
    // Limpiar contenedor
    this.container.innerHTML = "";

    // Crear botón de volver
    const backBtn = document.createElement("button");
    backBtn.textContent = "← Volver";
    backBtn.id = "back-btn";
    backBtn.addEventListener("click", () => {
      this.router.navigate("#menu");
    });

    // Crear título principal
    const title = document.createElement("h1");
    title.textContent = "2048 Oscar";

    // Crear puntuación
    const scoreTitle = document.createElement("h2");
    scoreTitle.textContent = "Puntuación: ";

    const scoreSpan = document.createElement("span");
    scoreSpan.id = "score";
    scoreSpan.textContent = "0";

    scoreTitle.appendChild(scoreSpan);

    // Crear tablero del juego
    const gameBoard = document.createElement("div");
    gameBoard.id = "game-board";

    // Añadir todo al contenedor
    this.container.appendChild(backBtn);
    this.container.appendChild(title);
    this.container.appendChild(scoreTitle);
    this.container.appendChild(gameBoard);

    // Inicializar juego
    const game = new Game(gameBoard);
    game.start();

    // Manejar eventos de teclado
    window.addEventListener("keydown", (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        game.handleInput(e.key);
      }
    });
  }
}
