import { state$ } from './services/stateService.js';
import { router } from './routes/router.js';
import { renderLogin } from './components/login.js';
import { renderHome } from './components/home.js';
import { renderGame } from './components/game.js';
import { renderRegister } from './components/register.js';

export function initApp() {
  router.init(); // inicializa el listener de rutas

state$.subscribe(state => {
  const route = state.route;
  const root = document.getElementById('app');
  root.innerHTML = '';

  if (route === 'login') renderLogin(root);
  else if (route === 'register') renderRegister(root);
  else if (route === 'home') renderHome(root);
  else if (route === 'game') renderGame(root);
});
}
