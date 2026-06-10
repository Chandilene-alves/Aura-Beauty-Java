const form = document.querySelector("#form-cadastro");
const nome = document.querySelector("#nome")
const email = document.querySelector("#email")
const perfil = document.querySelector("#perfil");
const senha = document.querySelector("#senha")
const confirmeSenha = document.querySelector("#confirme-senha")

document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function () {
        const input = this.previousElementSibling; // Pega o input que vem antes da imagem
        if (input.type === 'password') {
            input.type = 'text';
            this.src = '/assets/icons/visibility.svg'; // Caminho para o olho aberto
        } else {
            input.type = 'password';
            this.src = '/assets/icons/visibility_off.svg'; // Caminho para o olho fechado
        }
    });
});

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const nomeDigitado = nome.value
    const emailDigitado = email.value
    const perfilSelecionado = perfil.value;
    const senhaDigitado = senha.value
    const confirmeSenhaDigitado = confirmeSenha.value

    if (senhaDigitado !== confirmeSenhaDigitado) {

        mostrarNotificacao("As senhas não conferem", "erro");
        return
    }

    const dadosUsuario = {
        nome: nomeDigitado,
        email: emailDigitado,
        senha: senhaDigitado,
        confirmarSenha: confirmeSenhaDigitado,
        perfil: perfilSelecionado
    }
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:8080/usuarios/api', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dadosUsuario)
        })

        if (response.ok) {

            mostrarNotificacao("Usuário cadastrado com sucesso!", "sucesso");

        } else {
            const messageError = await response.text()
            alert(messageError)
            mostrarNotificacao(messageError, "erro");
        }
    } catch (error) {
        console.error("erro:", error)

        mostrarNotificacao("Não foi possível cadastrar!", "erro");
    }

})