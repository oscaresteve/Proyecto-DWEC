import Router from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
  //Contenedor de la app
  const app = document.getElementById("app");

  const router = new Router(app);
  router.load(location.hash || "#login");

  //Listener para el router
  window.addEventListener("hashchange", () => {
    router.load(location.hash);
  });
});
