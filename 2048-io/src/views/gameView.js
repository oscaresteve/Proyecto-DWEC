import { setState, state$ } from "../services/stateService.js";
import { createGameState, applyMove, isGameOver } from "../components/game.js";

// evitar subscripciones y listeners duplicados
let gameSubscription = null;
let keyListenerAdded = false;

export function renderGameView(root) {
  root.innerHTML = `
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 class="text-4xl font-extrabold mb-4 text-gray-800">2048-io</h1>
      <div id="game-board" class="board"></div>
      <div class="mt-4 text-xl font-semibold text-gray-700">
        Score: <span id="score">0</span>
      </div>
    </div>
  `;

  const gameBoard = root.querySelector("#game-board");
  const score = root.querySelector("#score");

  // crear game si no existe en el estado
  if (!state$.value.game) {
    setState({ game: createGameState(5) });
  }

  // subscripción para renderizar el board cuando haya cambios en game
  if (!gameSubscription) {
    gameSubscription = state$.subscribe(({ game }) => {
      if (!game) return;
      renderBoard(gameBoard, game.grid);
      score.textContent = game.score;
    });
  }

  // input del usuario
  if (!keyListenerAdded) {
    keyListenerAdded = true;

    root.addEventListener("keydown", (e) => {
      const valid = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      if (!valid.includes(e.key)) return;

      const { game } = state$.value;
      const newGame = applyMove(game, e.key);

      setState({ game: newGame });

      if (isGameOver(newGame)) {
        alert("¡Juego terminado!");
      }
    });
  }
}

// renderizado del grid con CSS clásico
function renderBoard(gameBoard, grid) {
  gameBoard.innerHTML = "";

  grid.forEach((row, rowIndex) =>
    row.forEach((tile, colIndex) => {
      const div = document.createElement("div");
      div.className = "tile"; // clase CSS para tiles
      if (tile) {
        div.textContent = tile.value;
        div.classList.add(`tile-${tile.value}`); // clase CSS específica por valor
      }
      gameBoard.appendChild(div);
    })
  );
}
