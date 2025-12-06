import { setState } from '../services/stateService.js';

export function renderHome(root) {
  const btn = document.createElement('button');
  btn.textContent = 'Go to Game';
  btn.addEventListener('click', () => setState({ route: 'game' }));
  root.appendChild(btn);
}
