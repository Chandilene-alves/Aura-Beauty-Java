function mostrarNotificacao(mensagem, tipo = 'sucesso') {

    let container = document.querySelector('#toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }


    const toast = document.createElement('div');
    toast.classList.add('toast', tipo);
    toast.innerText = mensagem;


    container.appendChild(toast);


    setTimeout(() => {
        toast.remove();
    }, 3200);
}