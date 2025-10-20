import GamePage from "./pages/gamePage.js";
import MenuPage from "./pages/menuPage.js";
import LoginPage from "./pages/loginPage.js";

export default class Router {
  constructor(container) {
    this.container = container;

    //Map de rutas
    this.routes = new Map([
      ["#game", GamePage],
      ["#login", LoginPage],
      ["#menu", MenuPage],
    ]);
  }

  //Funcion para renderizar la pagina segun el hash
  load(hash) {
    this.container.innerHTML = "";
    const PageClass = this.routes.get(hash) || LoginPage;

    //Se le pasa el contenedor y router y se ejecuta la funcion de render
    new PageClass(this.container, this).render();
  }

  //Funcion para cambiar el hash
  navigate(hash) {
    location.hash = hash;
  }
}
