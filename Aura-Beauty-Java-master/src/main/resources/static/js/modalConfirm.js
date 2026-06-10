function customConfirm(mensagem) {
    return new Promise((resolve) => {
        const modal = document.getElementById("modal-confirmacao");
        const texto = document.getElementById("modal-confirmacao-texto");
        const btnSim = document.getElementById("btn-confirmar-sim");
        const btnNao = document.getElementById("btn-confirmar-nao");


        texto.textContent = mensagem;
        modal.style.display = "flex";


        const encerrar = (resultado) => {
            modal.style.display = "none";

            btnSim.removeEventListener("click", aoConfirmar);
            btnNao.removeEventListener("click", aoCancelar);
            resolve(resultado);
        };

        const aoConfirmar = () => encerrar(true);
        const aoCancelar = () => encerrar(false);


        btnSim.addEventListener("click", aoConfirmar);
        btnNao.addEventListener("click", aoCancelar);
    });
}