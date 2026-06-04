const form = document.querySelector("#form-cadastro");
const nome = document.querySelector("#nome")
const email = document.querySelector("#email")
const cargo = document.querySelector("#cargo")
const senha = document.querySelector("#senha")
const confirmeSenha = document.querySelector("#confirme-senha")

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const nomeDigitado = nome.value
    const emailDigitado = email.value
    const cargoDigitado = cargo.value
    const senhaDigitado = senha.value
    const confirmeSenhaDigitado = confirmeSenha.value

    if(senhaDigitado !== confirmeSenhaDigitado){
        alert("As senhas não conferem")
        return
    }

    const dadosUsuario = {
        nome: nomeDigitado,
        email: emailDigitado,
        senha:senhaDigitado,
        confirmarSenha: confirmeSenhaDigitado,
        cargo: cargoDigitado,
    }

    try{
        const response = await fetch('http://localhost:8080/usuarios/api', {
            method: "POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(dadosUsuario)
        })

        if(response.ok){
            alert("Usuário cadastrado com sucesso!!")
            window.location.href = '/login';
        }else{
            const messageError = await response.text()
            alert(messageError)
        }
    }catch (error){
        console.error("erro:", error)
        alert("Não foi possivel cadastrar!")
    }

})