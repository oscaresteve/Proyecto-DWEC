import { login } from '../services/authService.js';

export function renderLogin(root) {
  const form = document.createElement('form');
  form.innerHTML = `
    <input type="email" placeholder="Email" required />
    <input type="password" placeholder="Password" required />
    <button>Login</button>
  `;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = form[0].value;
    const password = form[1].value;
    login(email, password);
  });

  root.appendChild(form);
}
