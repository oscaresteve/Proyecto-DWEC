import { setState, state$ } from "../services/stateService.js";
import { createGameState, applyMove, isGameOver } from "../components/game.js";
import { saveGame } from "../services/gameService.js";

// evitar subscripciones y listeners duplicados
let gameSubscription = null;
let keyListenerAdded = false;

let gameOver = false;

export function renderGameView(root) {
  root.innerHTML = `
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 class="text-4xl font-extrabold mb-4 text-gray-800">2048-io</h1>
      <div id="game-board" class="board"></div>
      <div class="mt-4 text-xl font-semibold text-gray-700">
        Score: <span id="score">0</span>
      </div>
      <div class="mt-2 text-xl font-bold text-gray-700">
        Max Score: <span id="max-score">0</span>
      </div>
      <div class="mt-4 flex flex-col items-center">
        <div id="game-over-container" class="mb-2"></div>
        <button id="restart-game" class="px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600">
          Reiniciar Partida
        </button>
      </div>
    </div>
  `;

  const gameBoard = root.querySelector("#game-board");
  const score = root.querySelector("#score");
  const maxScore = root.querySelector("#max-score");
  const gameOverContainer = root.querySelector("#game-over-container");
  const restartButton = root.querySelector("#restart-game");

  if (!state$.value.user.game) {
    const newGame = createGameState(5);
    const prevUser = state$.value.user;
    setState({
      user: {
        ...prevUser,
        game: newGame,
      },
    });
  }

  if (!gameSubscription) {
    gameSubscription = state$.subscribe((state) => {
      const { user } = state;
      if (!user) return;

      const game = user.game;
      if (!game) return;

      renderBoard(gameBoard, game.grid);
      score.textContent = game.score;
      maxScore.textContent = user.max_score ?? 0;

      gameOver = isGameOver(game);
      renderGameOverText();

      saveGame();
    });
  }

  if (!keyListenerAdded) {
    keyListenerAdded = true;

    window.addEventListener("keydown", (e) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) &&
        !gameOver
      ) {
        e.preventDefault();

        const prevUser = state$.value.user;
        if (!prevUser || !prevUser.game) return;

        const newGame = applyMove(prevUser.game, e.key);
        const newMaxScore = Math.max(
          prevUser.max_score ?? 0,
          newGame.score ?? 0
        );

        setState({
          user: {
            ...prevUser,
            game: newGame,
            max_score: newMaxScore,
          },
        });
      }
    });
  }

  restartButton.addEventListener("click", (e) => {
    e.preventDefault();
    const prevUser = state$.value.user;
    if (!prevUser || !prevUser.game) return;

    const newGame = createGameState(5);
    setState({
      user: {
        ...prevUser,
        game: newGame,
      },
    });
    gameOver = false;
  });

  function renderGameOverText() {
    gameOverContainer.textContent = gameOver ? "¡Game Over!" : "";
  }
}

function renderBoard(gameBoard, grid) {
  gameBoard.innerHTML = "";

  grid.forEach((row) =>
    row.forEach((tile) => {
      const div = document.createElement("div");
      div.className = "tile";
      if (tile) {
        div.textContent = tile.value;
        div.classList.add(`tile-${tile.value}`);
      }
      gameBoard.appendChild(div);
    })
  );
}
