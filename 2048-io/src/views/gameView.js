// views/gameView.js
import { setState, state$ } from "../services/stateService.js";
import { createGameState, applyMove, isGameOver } from "../components/game.js";

let gameSubscription = null; // Para evitar múltiples suscripciones
let keyListenerAdded = false; // Para evitar múltiples listeners

export function renderGameView(root) {
  root.innerHTML = `
    <h1 class="text-2xl font-bold">2048-io</h1>
    <div class="grid grid-cols-5 gap-1" id="game-board"></div>
    <div class="mt-2 text-lg">Score: <span id="score"></span></div>
  `;

  const gameBoard = root.querySelector("#game-board");
  const score = root.querySelector("#score");

  // Inicializar estado del juego solo si no existe
  if (!state$.value.game) {
    setState({ game: createGameState(5) });
  }

  // ------------------------
  // Suscripción reactiva
  // ------------------------
  if (!gameSubscription) {
    gameSubscription = state$.subscribe(({ game }) => {
      if (!game) return;

      renderBoard(gameBoard, game.grid);
      score.textContent = game.score;
    });
  }

  // ------------------------
  // Input de usuario (solo una vez)
  // ------------------------
  if (!keyListenerAdded) {
    keyListenerAdded = true;

    // Para que el div reciba eventos de teclado
    root.tabIndex = 0;
    root.focus();

    root.addEventListener("keydown", (e) => {
      const valid = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      if (!valid.includes(e.key)) return;

      const { game } = state$.value;
      const newGame = applyMove(game, e.key);

      setState({ game: newGame });
      console.log(newGame);
      

      if (isGameOver(newGame)) {
        alert("¡Juego terminado!");
      }
    });
  }
}

function renderBoard(gameBoard, grid) {
  gameBoard.innerHTML = "";

  grid.forEach(row =>
    row.forEach(tile => {
      const div = document.createElement("div");
      div.className = "tile bg-gray-200 rounded p-4 text-center font-bold";
      if (tile) div.textContent = tile.value;
      gameBoard.appendChild(div);
    })
  );
}
