import { signUp } from "../db/supabaseService.js";

export default class RegisterPage {
  constructor(container, router) {
    this.container = container;
    this.router = router;
  }

  async register(email, password) {
    try {
      const { error } = await signUp(email, password);
      if (error) {
        alert(error);
      } else {
        alert("Register successful!");
        this.router.navigate("game");
      }
    } catch (error) {}
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
    title.textContent = "Register";
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
    submitButton.textContent = "Register";
    submitButton.className = "btn btn-primary w-100 mt-3";

    // Evento submit
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.register(emailInput.value, passwordInput.value);
    });

    // Append al contenedor
    form.append(emailGroup, passwordGroup, submitButton);
    card.appendChild(form);

    //Boton para ir al login
    const loginButton = document.createElement("button");
    loginButton.textContent = "Go to Login";
    loginButton.className = "btn btn-link mt-2 w-100";
    loginButton.type = "button";
    loginButton.addEventListener("click", (e) => {
      this.router.navigate("login");
    });
    card.appendChild(loginButton);

        // Añadir todo al contenedor
    wrapper.appendChild(card);
    this.container.appendChild(wrapper);
  }
}
