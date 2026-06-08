const modal = document.getElementById("modal-agendamento");
const btnNovo = document.querySelector(".btn-new-appointment");
const btnFechar = document.getElementById("btn-fechar");
const btnCancelar = document.getElementById("btn-cancelar");

// Abre a modal
btnNovo.addEventListener("click", () => {
  console.log("clicoou");
  modal.style.display = "flex";
});

// Fecha a modal (no X ou no Cancelar)
[btnFechar, btnCancelar].forEach((btn) => {
  btn.addEventListener("click", () => {
    modal.style.display = "none";
  });
});

// Fecha se clicar fora da modal branca
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
