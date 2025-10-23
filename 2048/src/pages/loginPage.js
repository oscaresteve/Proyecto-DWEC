import { signIn } from "../db/supabaseService.js";

export default class LoginPage {
  constructor(container, router) {
    this.container = container;
    this.router = router;
  }

  async logIn(email, password) {
    try {
      const { error } = await signIn(email, password);
      if (error) {
        alert(error);
      } else {
        alert("Login successful!");
        this.router.navigate("game");
      }
    } catch (error) {}
  }

  render() {
    // Limpiar contenedor
    this.container.innerHTML = "";

    // Crear formulario
    const form = document.createElement("form");

    // Crear título
    const title = document.createElement("h2");
    title.textContent = "Login";
    form.appendChild(title);

    // Input de email
    const emailLabel = document.createElement("label");
    emailLabel.textContent = "Email:";
    emailLabel.setAttribute("for", "email");
    form.appendChild(emailLabel);

    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.id = "email";
    emailInput.name = "email";
    emailInput.required = true;
    form.appendChild(emailInput);

    // Input de password
    const passwordLabel = document.createElement("label");
    passwordLabel.textContent = "Password:";
    passwordLabel.setAttribute("for", "password");
    form.appendChild(passwordLabel);

    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.id = "password";
    passwordInput.name = "password";
    passwordInput.required = true;
    form.appendChild(passwordInput);

    // Botón de submit
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Login";
    form.appendChild(submitButton);

    // Agregar evento submit
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.logIn(emailInput.value, passwordInput.value);
    });

    // Append al contenedor
    this.container.appendChild(form);
  }
}
