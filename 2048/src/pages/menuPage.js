export default class MenuPage {
  constructor(container, router) {
    this.container = container;
    this.router = router;
  }

  render() {
    this.container.innnerHTML = "";

    //Crear titulo
    const title = document.createElement("h1");
    title.textContent = "Bienvenido a 2048 Oscar";

    //Crear boton de volver
    const startBtn = document.createElement("button");
    startBtn.id = "start-btn";
    startBtn.textContent = "Jugar";
    startBtn.addEventListener("click", () => {
      this.router.navigate("#game");
    });

    this.container.appendChild(title);
    this.container.appendChild(startBtn);
  }
}
