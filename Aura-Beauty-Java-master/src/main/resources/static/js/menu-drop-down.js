document.addEventListener("DOMContentLoaded", () => {
    const profile = document.querySelector(".profile");
    const dropdown = document.getElementById("logoutDropdown");
    const btnLogout = document.getElementById("btnLogout");

    // 1. Abre e fecha o menu ao clicar em qualquer lugar do perfil (imagem, nome ou seta)
    profile.addEventListener("click", (e) => {
        e.stopPropagation(); // Impede o clique de propagar para o document
        dropdown.classList.toggle("show");
        profile.classList.toggle("active");
    });

    // 2. Fecha o menu automaticamente se clicar em qualquer outra parte da tela
    document.addEventListener("click", () => {
        dropdown.classList.remove("show");
        profile.classList.remove("active");
    });

    // 3. Lógica do Logout
    btnLogout.addEventListener("click", (e) => {
        e.preventDefault();

        // Destrói as sessões locais de segurança
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        // Redireciona o usuário para a tela de autenticação
        window.location.href = "/login";
    });
});