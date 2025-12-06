import { register } from '../services/authService.js';
import { setState } from '../services/stateService.js';

export function renderRegister(root) {
  const container = document.createElement('div');
  container.className = "flex items-center justify-center h-screen bg-gray-100";

  const form = document.createElement('form');
  form.className = "bg-white p-8 rounded-lg shadow-md w-96 flex flex-col gap-4";

  form.innerHTML = `
    <h2 class="text-2xl font-bold text-center mb-4">Register</h2>
    <input type="email" placeholder="Email" required
      class="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"/>
    <input type="password" placeholder="Password" required
      class="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"/>
    <button type="submit"
      class="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">Register</button>
    <p class="text-sm text-gray-500 text-center mt-2">Already have an account? <span id="login-link" class="text-blue-500 cursor-pointer hover:underline">Login</span></p>
  `;

  // Manejo de submit
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = form[0].value;
    const password = form[1].value;

    const data = await register(email, password);
    if (data.user) {
      // Después del registro, redirige a login
      setState({ route: 'login' });
    }
  });

  // Link a login
  form.querySelector('#login-link').addEventListener('click', () => {
    setState({ route: 'login' });
  });

  container.appendChild(form);
  root.appendChild(container);
}
