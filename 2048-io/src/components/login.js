import { login } from '../services/authService.js';
import { setState } from '../services/stateService.js';

export function renderLogin(root) {

  const container = document.createElement('div');
  container.className = "flex items-center justify-center h-screen bg-gray-100";

  const form = document.createElement('form');
  form.className = "bg-white p-8 rounded-lg shadow-md w-96 flex flex-col gap-4";

  form.innerHTML = `
    <h2 class="text-2xl font-bold text-center mb-4">Login</h2>
    <input type="email" placeholder="Email" required
      class="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
    <input type="password" placeholder="Password" required
      class="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
    <button type="submit"
      class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">Login</button>
    <p class="text-sm text-gray-500 text-center mt-2">Don't have an account? <span id="register-link" class="text-blue-500 cursor-pointer hover:underline">Register</span></p>
  `;

  // Manejo de submit
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = form[0].value;
    const password = form[1].value;
    await login(email, password);
  });

  // Link a registro (opcional)
form.querySelector('#register-link').addEventListener('click', () => {
  setState({ route: 'register' }); // Navega a la ruta de registro
});


  container.appendChild(form);
  root.appendChild(container);
}
