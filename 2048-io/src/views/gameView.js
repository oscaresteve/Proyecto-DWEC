import { setState, state$ } from "../services/stateService.js";
import { createGameState, applyMove, isGameOver } from "../components/game.js";
import { saveGame } from "../services/gameService.js";
import { fetchGlobalRanking } from "../services/rankingService.js";
import { updateNickname } from "../services/userService.js";
import { logout } from "../services/authService.js";
import { uploadAvatar, fetchAvatar } from "../services/userService.js";

let gameSubscription = null;
let keyListenerAdded = false;
let gameOver = false;

export function renderGameView(root) {
  root.innerHTML = `
  <div class="flex flex-row min-h-screen bg-gray-100 p-4">
    <div class="w-1/4 mr-4 bg-white p-4 rounded shadow">
      <h2 class="text-2xl font-bold mb-2">Mi Perfil</h2>
      <div class="mb-2"><strong>Email:</strong> <span id="user-email"></span></div>
      <div class="mb-4">
        <label for="nickname-input" class="block font-semibold mb-1">Nickname:</label>
        <input id="nickname-input" type="text" class="w-full border rounded px-2 py-1" />
        <button id="update-nickname-btn" class="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Actualizar</button>
        <p id="nickname-msg"></p>
        <form id="avatarForm" class="mt-3 flex flex-col gap-2">
          <input class="border rounded px-2 py-1" type="file" name="avatar" accept="image/*" />
          <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" type="submit">Subir foto</button>
        </form>
        <img id="profileAvatar" class="mt-3 rounded shadow" src="" alt="Avatar" width="100" />
        <button id="logout-btn" class="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Cerrar sesión</button>
      </div>
    </div>

    <div class="flex flex-col items-center justify-start w-2/4 px-4">

  <h1 class="text-4xl font-extrabold mb-4 text-gray-800">2048 Adventure</h1>

  <!-- HUD del nivel -->
  <div class="w-full flex flex-col items-center mb-4">
    <div class="px-6 py-3 bg-purple-600 text-white rounded-xl shadow-lg text-3xl font-bold">
      Nivel <span id="level" class="ml-2">1</span>
    </div>
  </div>

  <!-- Objetivo representado como tile -->
  <div class="mt-2 mb-6 flex flex-col items-center">
    <p class="text-lg font-semibold text-gray-700 mb-2">Objetivo:</p>
    <div class="targetBoard shadow-xl rounded-lg">
      <div id="target-tile" class="tile tile-16">16</div>
    </div>
    
  </div>

  <!-- Tablero de juego -->
  <div id="game-board" class="board shadow-xl rounded-lg"></div>

  <!-- Score -->
  <div class="mt-6 space-y-2 text-center">
    <div class="text-xl font-semibold text-gray-700">
      Score: <span id="score">0</span>
    </div>
    <div class="text-xl font-bold text-gray-700">
      Max Score: <span id="max-score">0</span>
    </div>
  </div>

  <!-- Controles -->
  <div class="mt-6 flex flex-col items-center gap-3 w-full">
    <div id="game-over-container" class="text-red-600 text-xl font-bold"></div>

    <button id="restart-game"
      class="w-40 px-4 py-2 bg-yellow-500 text-white font-bold rounded hover:bg-yellow-600 transition">
      Reiniciar partida
    </button>

    <button id="restart-level"
      class="w-40 px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition">
      Reiniciar nivel
    </button>
  </div>
</div>


    <div class="w-1/4 ml-4">
      <h2 class="text-2xl font-bold mb-2">Ranking Global</h2>
      <ul id="ranking-list" class="bg-white p-2 rounded shadow"></ul>
    </div>
  </div>
`;

  const gameBoard = root.querySelector("#game-board");
  const score = root.querySelector("#score");
  const maxScore = root.querySelector("#max-score");
  const level = document.getElementById("level");
  const gameOverContainer = root.querySelector("#game-over-container");
  const restartGameButton = root.querySelector("#restart-game");
  const restartLevelButton = root.querySelector("#restart-level");
  const rankingList = root.querySelector("#ranking-list");
  const userEmailSpan = root.querySelector("#user-email");
  const nicknameInput = root.querySelector("#nickname-input");
  const updateNicknameBtn = root.querySelector("#update-nickname-btn");
  const nicknameMsg = root.querySelector("#nickname-msg");
  const targetTile = document.getElementById("target-tile");
  const logoutBtn = root.querySelector("#logout-btn");
  const avatarForm = root.querySelector("#avatarForm");
  const profileAvatar = root.querySelector("#profileAvatar");

  function renderGameOverText() {
    gameOverContainer.textContent = gameOver ? "¡Game Over!" : "";
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

  async function updateRanking() {
    const { success, data: ranking, error } = await fetchGlobalRanking(10);

    if (!success) {
      console.error("No se pudo actualizar el ranking:", error.message);
      rankingList.innerHTML = `<li class="text-red-500">No se pudo cargar el ranking</li>`;
      return;
    }

    const currentNickname = state$.value.user?.nickname;

    rankingList.innerHTML = ranking
      .map((user, index) => {
        const isCurrent = user.nickname === currentNickname;

        return `
        <li class="flex justify-between py-1 px-2 rounded mb-1 ${
          isCurrent ? "bg-yellow-200 font-bold" : ""
        }">
          <span>${index + 1}. ${user.nickname}</span>
          <span>${user.max_score}</span>
        </li>
      `;
      })
      .join("");
  }

  if (!state$.value.user.game) {
    const prevUser = state$.value.user;
    const newGame = createGameState();
    setState({ user: { ...prevUser, game: newGame } });
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

  if (!gameSubscription) {
    gameSubscription = state$.subscribe(async (state) => {
      const { user } = state;
      if (!user || !user.game) return;

      const game = user.game;

      renderBoard(gameBoard, game.grid);

      score.textContent = game.score;
      maxScore.textContent = user.max_score ?? 0;
      level.textContent = game.level;

      targetTile.textContent = game.target;
      targetTile.className = "tile";
      targetTile.classList.add(`tile-${game.target}`);

      gameOver = isGameOver(game);
      renderGameOverText();

      await saveGame();

      updateRanking();

      if (game.levelCompleted) {
        const nextLevel = game.level + 1;
        const newLevelGame = createGameState(5, nextLevel);

        setState({
          user: {
            ...state.user,
            game: newLevelGame,
          },
        });
        return;
      }
    });
  }

  if (state$.value.user) {
    userEmailSpan.textContent = state$.value.user.email;
    nicknameInput.value = state$.value.user.nickname ?? "";
    profileAvatar.src = state$.value.user.avatar_url || "";
  }

  updateNicknameBtn.addEventListener("click", async () => {
    const prevUser = state$.value.user;

    const newNickname = nicknameInput.value.trim();
    if (!newNickname || newNickname === prevUser.nickname) return;

    const { success, error } = await updateNickname(
      prevUser.email,
      prevUser.token,
      newNickname
    );

    if (success) {
      setState({
        user: {
          ...prevUser,
          nickname: newNickname,
        },
      });

      updateRanking();

      nicknameMsg.textContent = "Nickname actualizado correctamente!";
      nicknameMsg.className = "text-green-500 text-sm text-center mt-1";
      setTimeout(() => (nicknameMsg.textContent = ""), 3000);
    } else {
      nicknameMsg.textContent = "No se pudo actualizar el nickname";
      nicknameMsg.className = "text-red-500 text-sm text-center mt-1";
      setTimeout(() => (nicknameMsg.textContent = ""), 3000);
    }
  });

  restartGameButton.addEventListener("click", (e) => {
    e.preventDefault();

    const prevUser = state$.value.user;
    if (!prevUser || !prevUser.game) return;

    const newGame = createGameState();

    setState({
      user: {
        ...prevUser,
        game: newGame,
      },
    });

    gameOver = false;
  });

  restartLevelButton.addEventListener("click", (e) => {
    e.preventDefault();

    const prevUser = state$.value.user;
    if (!prevUser || !prevUser.game) return;

    const newGame = createGameState(5, prevUser.game.level);

    setState({
      user: {
        ...prevUser,
        game: newGame,
      },
    });

    gameOver = false;
  });

  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (gameSubscription) {
      gameSubscription.unsubscribe();
      gameSubscription = null;
    }

    keyListenerAdded = false;
    gameOver = false;

    logout();
  });

  avatarForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = avatarForm.avatar.files[0];
    if (!file) {
      nicknameMsg.textContent = "Selecciona una imagen";
      nicknameMsg.className = "text-red-500 text-sm text-center mt-1";
      return;
    }

    const { email, token } = state$.value.user;

    const { success, filename } = await uploadAvatar(file, email, token);

    if (success) {
      const { success: urlSuccess, url } = await fetchAvatar(
        filename,
        token
      );
      if (urlSuccess) {
        profileAvatar.src = url;
        nicknameMsg.textContent = "Imagen subida correctamente!";
        nicknameMsg.className = "text-green-500 text-sm text-center mt-1";
        const currentUser = state$.value.user;

        setState({
          user: {
            ...currentUser,
            avatar_url: url,
          },
        });
      }
    } else {
      nicknameMsg.textContent = "Error subiendo imagen";
      nicknameMsg.className = "text-red-500 text-sm text-center mt-1";
    }

    setTimeout(() => (nicknameMsg.textContent = ""), 3000);
  });

  updateRanking();
}
