document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function() {
        const input = this.previousElementSibling;
        if (input.type === 'password') {
            input.type = 'text';
            this.src = '/assets/icons/visibility.svg';
        } else {
            input.type = 'password';
            this.src = '/assets/icons/visibility_off.svg';
        }
    });
});

const formLogin = document.querySelector("#loginForm");

formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = document.querySelector("#username");
    const password = document.querySelector("#password");


    const loginData = {
        email: user.value,
        senha: password.value,
    };

    try {
        const api = "http://localhost:8080/login/api";
        const response = await fetch(api, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify(loginData)
        });

        console.log("Status da resposta da API:", response.status);

        if (response.ok) {

            const data = await response.json();

            localStorage.setItem('token', data.token);
            localStorage.setItem("nomeUsuario", data.nome);
            localStorage.setItem("perfilUsuario", data.perfil);


            if (data.perfil === 'ADMIN') {
                window.location.href = "/dashboard";
            } else {
                window.location.href = "/agendamentos-colaborador";
            }

        } else if (response.status === 403 || response.status === 401) {
            mostrarNotificacao("Email ou senha incorretos", "erro");
        } else {
            mostrarNotificacao("Email ou senha incorretos", "erro");
        }
    } catch (error) {
        console.log(error);
    }
});