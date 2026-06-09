document.addEventListener("DOMContentLoaded", () => {
    const profile = document.querySelector(".profile");
    const dropdown = document.getElementById("logoutDropdown");
    const btnLogout = document.getElementById("btnLogout");

    profile.addEventListener("click", (e) => {
        e.stopPropagation(); // Impede o clique de propagar para o document
        dropdown.classList.toggle("show");
        profile.classList.toggle("active");
    });

    document.addEventListener("click", () => {
        dropdown.classList.remove("show");
        profile.classList.remove("active");
    });

    btnLogout.addEventListener("click", (e) => {
        e.preventDefault();

        // Destrói as sessões locais de segurança
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        window.location.href = "/login";
    });
});