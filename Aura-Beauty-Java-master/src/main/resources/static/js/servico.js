document.addEventListener("DOMContentLoaded", ()=>{
    carregarServicos()
})

async function carregarServicos(){
    try{
        const response = await fetch('/api/servicos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if(!response.ok){
            throw new Error("Erro ao buscar serviços")
        }

        const servicos = await response.json()
        renderizarTabela(servicos)
    }catch (error) {
        console.error("Erro ao buscar no servidor:", error)
        alert("Não foi possível carregar a lista de serviços")
    }
}

function renderizarTabela(servicos){
    const tbody = document.getElementById("tabela-servicos")
    tbody.innerHTML = "";

    if(servicos.length === 0){
        tbody.innerHTML = `<tr><td >Nenhum serviço cadastrado.</td></tr>`;
        return
    }

    servicos.forEach(servico =>{
        const tr = document.createElement("tr");

        const duracaoFormatada = servico.duracaoMinutos >= 60 ? `${Math.floor(servico.duracaoMinutos / 60)}h` : `${servico.duracaoMinutos}min`;

        const precoFormatado = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(servico.preco);

        tr.innerHTML = `
            <td>${servico.nome}</td>
            <td class="descricao-truncate">${servico.descricaoCurta || '-'}</td>
            <td >${duracaoFormatada}</td>
            <td>${precoFormatado}</td>
            <td class="btn-flex">
                <button class="btn-edit" onclick="editarServico(${servico.id})">
                    <img src="/assets/icons/edit.svg" alt="Editar" />
                </button>
                <button class="btn-delete" onclick="deletarServico(${servico.id})">
                    <img src="/assets/icons/delete.svg" alt="Excluir" />
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    })
}

async function deletarServico(id) {
    const confirmar = confirm("Tem certeza que deseja excluir este serviço?");

    if (!confirmar) return;

    try {

        const response = await fetch(`/api/servicos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok || response.status === 204) {
            alert("Serviço excluído com sucesso!");


            await carregarServicos();
        } else {
            throw new Error("Não foi possível excluir o serviço.");
        }

    } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Ocorreu um erro ao tentar excluir o serviço.");
    }
}

