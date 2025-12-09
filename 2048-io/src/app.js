import { state$ } from "./services/stateService.js";
import { router } from "./routes/router.js";
import { renderLoginView } from "./views/loginView.js";
import { renderRegisterView } from "./views/registerView.js";
import { renderGameView } from "./views/gameView.js";

let currentRoute = null;

export function initApp() {
  router.init();

  state$.subscribe((state) => {
    const route = state.route;
    const root = document.getElementById("app");

    if (route !== currentRoute) {
      root.innerHTML = "";
      if (route === "login") renderLoginView(root);
      else if (route === "register") renderRegisterView(root);
      else if (route === "game") renderGameView(root);
      currentRoute = route;
    }
  });
}
