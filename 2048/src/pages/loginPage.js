import { signIn } from "../db/supabaseService.js";
import { setUser, setError, setView, setLoading } from "../state/store.js";

export default class LoginPage {
  constructor(container, router) {
    this.container = container;
    this.router = router;
  }

  async login(email, password) {
    try {
      setLoading(true);

      const { error, user, session } = await signIn(email, password);

      if (error) {
        setError(error.message || "Error al iniciar sesión");
        return;
      }

      // Guardar user en el estado
      setUser(user || session?.user);
      setError(null);

      setView("game");
      this.router.navigate("game");
    } catch (error) {
      console.error(error);
      setError("Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  render() {
    // Limpiar contenedor
    this.container.innerHTML = "";

    // Contenedor centrado
    const wrapper = document.createElement("div");
    wrapper.className =
      "d-flex justify-content-center align-items-center bg-light";
    // Tarjeta
    const card = document.createElement("div");
    card.className = "card shadow-lg p-4";

    // Título
    const title = document.createElement("h2");
    title.textContent = "Login";
    title.className = "text-center mb-4";
    card.appendChild(title);

    // Formulario
    const form = document.createElement("form");
    form.className = "d-flex flex-column gap-3";

    // Email
    const emailGroup = document.createElement("div");
    emailGroup.className = "form-group";
    const emailLabel = document.createElement("label");
    emailLabel.textContent = "Email:";
    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.className = "form-control";
    emailInput.required = true;
    emailGroup.append(emailLabel, emailInput);

    // Password
    const passwordGroup = document.createElement("div");
    passwordGroup.className = "form-group";
    const passwordLabel = document.createElement("label");
    passwordLabel.textContent = "Password:";
    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.className = "form-control";
    passwordInput.required = true;
    passwordGroup.append(passwordLabel, passwordInput);

    // Botón de submit
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className = "btn btn-primary w-100 mt-3";
    submitButton.textContent = "Login";

    // Evento submit
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.login(emailInput.value, passwordInput.value);
    });

    form.append(emailGroup, passwordGroup, submitButton);
    card.appendChild(form);

    // Botón para ir a Register
    const registerButton = document.createElement("button");
    registerButton.type = "button";
    registerButton.className = "btn btn-link mt-2 w-100";
    registerButton.textContent = "Go to Register";
    registerButton.addEventListener("click", () => {
      this.router.navigate("register");
    });
    card.appendChild(registerButton);

    // Añadir todo al contenedor
    wrapper.appendChild(card);
    this.container.appendChild(wrapper);
  }
}
