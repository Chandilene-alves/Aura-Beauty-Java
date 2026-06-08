document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function() {
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

const formLogin = document.querySelector("#loginForm")

formLogin.addEventListener("submit", async (e) =>{
    e.preventDefault()

    const user = document.querySelector("#username");
    const password = document.querySelector("#password");



    const loginData = {
        email: user.value,
        senha: password.value,
    }
try {
    const api = "http://localhost:8080/login/api"
    const response = await fetch(api, {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify(loginData)
    })
        console.log("Status da resposta da API:", response.status);

    if(response.ok){
        const token = await response.json()

        localStorage.setItem('token', token.token)
       localStorage.setItem("nomeUsuario", token.nome)

        window.location.href= "/dashboard"
    }else if(response.status === 403 || response.status === 401){
alert("Email ou senha incorretos")
    }else{
        alert("Não foi possivel fazer login")

    }
}catch (error){
        console.log(error)

}

})
