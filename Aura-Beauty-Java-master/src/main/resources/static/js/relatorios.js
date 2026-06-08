document.addEventListener("DOMContentLoaded", ()=>{
    const token = localStorage.getItem("token");


    const nomeUsuario = localStorage.getItem("nomeUsuario") || "Colaborador";
    const primeiroNome = nomeUsuario.split(" ")[0];

    if (!token) {
        alert("Acesso negado! Por favor, faça login.");
        window.location.href = "/login";
        return;
    }

    const nomeHeader = document.getElementById("saudacao-header");
    if (nomeHeader) {
        nomeHeader.textContent = primeiroNome;
    }

})