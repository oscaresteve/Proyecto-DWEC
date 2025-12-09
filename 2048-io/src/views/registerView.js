import { register } from "../services/authService.js";
import { setState } from "../services/stateService.js";

export function renderRegisterView(root) {
  root.innerHTML = `
    <div class="flex items-center justify-center h-screen bg-gray-100">
      <form id="register-form" class="bg-white p-8 rounded-lg shadow-md w-96 flex flex-col gap-4">
        <h2 class="text-2xl font-bold text-center mb-4">Register</h2>
        <input type="email" id="email" placeholder="Email" required
          class="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"/>
        <input type="password" id="password" placeholder="Password" required
          class="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"/>
        <button type="submit"
          class="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">Register</button>
        <p class="text-sm text-gray-500 text-center mt-2">
          Already have an account? 
          <span id="login-link" class="text-blue-500 cursor-pointer hover:underline">Login</span>
        </p>
      </form>
    </div>
  `;

  const form = root.querySelector("#register-form");
  const emailInput = root.querySelector("#email");
  const passwordInput = root.querySelector("#password");
  const loginLink = root.querySelector("#login-link");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = await register(emailInput.value, passwordInput.value);
    if (data.user) {
      setState({ route: "login" });
    }
  });

  loginLink.addEventListener("click", () => {
    setState({ route: "login" });
  });
}
