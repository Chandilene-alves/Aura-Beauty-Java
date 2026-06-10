let filtroAtual = "";
let agendamentoId = null;

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");


    const nomeUsuario = localStorage.getItem("nomeUsuario") || "Colaborador";
    const primeiroNome = nomeUsuario.split(" ")[0];

    if (!token) {

        mostrarNotificacao("Acesso negado! Por favor, faça login.", "erro");
        window.location.href = "/login";
        return;
    }


    const horaAtual = new Date().getHours();
    let saudacao = "";

    if (horaAtual >= 5 && horaAtual < 12) {
        saudacao = "Bom dia";
    } else if (horaAtual >= 12 && horaAtual < 18) {
        saudacao = "Boa tarde";
    } else {
        saudacao = "Boa noite";
    }

    const banner = document.getElementById("saudacao-banner");
    if (banner) {
        banner.textContent = `${saudacao}, ${primeiroNome}! `;
    }

    const nomeHeader = document.getElementById("saudacao-header");
    if (nomeHeader) {
        nomeHeader.textContent = primeiroNome;
    }

    let dia = new Date().toLocaleDateString('pt-BR', {weekday: "long"});
    dia = dia.charAt(0).toUpperCase() + dia.slice(1);

    const elementoDia = document.getElementById("dia-da-semana");
    if (elementoDia) {
        elementoDia.textContent = dia;
    }

});


function formatarDataJS(date) {
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

async function filtrarAgendamentos(tipoPeriodo) {
    const token = localStorage.getItem("token");
    const hoje = new Date();

    let url = "";
    let titulo = "";
    filtroAtual = tipoPeriodo;

    if (tipoPeriodo === 'hoje') {
        const dataHoje = formatarDataJS(hoje);
        url = `http://localhost:8080/api/agendamentos/por-data?data=${dataHoje}`;
        titulo = "Agendamentos de Hoje";

    } else if (tipoPeriodo === 'semana') {

        const diaSemana = hoje.getDay();
        const primeiroDia = new Date(hoje);
        primeiroDia.setDate(hoje.getDate() - diaSemana);

        const ultimoDia = new Date(primeiroDia);
        ultimoDia.setDate(primeiroDia.getDate() + 6);

        url = `http://localhost:8080/api/agendamentos/periodo?inicio=${formatarDataJS(primeiroDia)}&fim=${formatarDataJS(ultimoDia)}`;
        titulo = "Agendamentos da Semana";

    } else if (tipoPeriodo === 'mes') {

        const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

        url = `http://localhost:8080/api/agendamentos/periodo?inicio=${formatarDataJS(primeiroDiaMes)}&fim=${formatarDataJS(ultimoDiaMes)}`;
        titulo = "Agendamentos do Mês";
    }

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const dados = await response.json();


            const elementoTitulo = document.getElementById("titulo-listagem");
            if (elementoTitulo) elementoTitulo.textContent = titulo;

            exibirAgendamentos(dados);


            document.getElementById("container-cards").style.display = "none";
            document.getElementById("container-tabela").style.display = "block";
        } else if (response.status === 403 || response.status === 401) {

            mostrarNotificacao("Sua sessão expirou. Por favor, faça login novamente.", "erro");
            window.location.href = "/login";
        }
    } catch (error) {
        console.error("Erro ao buscar dados do período:", error);
    }
}


function voltarParaCards() {
    document.getElementById("container-tabela").style.display = "none";
    document.getElementById("container-cards").style.display = "flex";
}

function formatarNome(nome) {
    if (!nome) return '';
    return nome
        .toLowerCase()
        .split(' ')
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join(' ');
}


function exibirAgendamentos(lista) {

    const tabelaCorpo = document.getElementById("table-agendamentos");

    if (!tabelaCorpo) {
        console.error("Elemento 'table-agendamentos' não foi encontrado no HTML.");
        return;
    }

    tabelaCorpo.innerHTML = "";

    if (lista.length === 0) {
        tabelaCorpo.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: #2c3e50; padding: 20px; font-weight: 500;">
                    Nenhum agendamento encontrado para este período.
                </td>
            </tr>`;
        return;
    }
    const agora = new Date();

    lista.forEach(agendamento => {
        let classeStatus = "";
        let textoStatus = "";

        const dataHoraOriginal = new Date(agendamento.dataHora || agendamento.data);
        const dataFormatada = dataHoraOriginal.toLocaleDateString('pt-BR');
        const horaFormatada = dataHoraOriginal.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});

        if (agendamento.status === "CANCELADO") {
            classeStatus = "cancel";
            textoStatus = "Cancelado";
        } else if (dataHoraOriginal < agora) {
            classeStatus = "completed";
            textoStatus = "Concluído";
        } else {
            classeStatus = "confirmed";
            textoStatus = "Agendado";
        }

        const linha = document.createElement("tr");

        const renderizarBotoes = (textoStatus === "Agendado")
            ? `
                <button class="btn-edit" onclick="editarAgendamento(${agendamento.id})">
                    <img src="/assets/icons/edit.svg" alt="Editar" />
                </button>
                <button class="btn-delete" onclick="cancelarAgendamento(${agendamento.id})">
                    <img src="/assets/icons/block.svg" alt="Deletar" />
                </button>
              `
            : `<span style="color: #a0aec0; font-size: 0.9rem; font-style: italic;"> -- -- -- -- --</span>`;

        linha.innerHTML = `
            <td>${dataFormatada} | ${horaFormatada}</td>
            <td><strong>${formatarNome(agendamento.cliente)}</strong></td>
            <td>${agendamento.nomeServico || 'Serviço'}</td>
            <td><strong>${formatarNome(agendamento.profissional)}</strong></td>
            <td>${agendamento.duracao || '45 min'}</td>
            <td><span class="status ${classeStatus}">${textoStatus}</span></td>
           <td>
                <div class="btn-flex">
                    ${renderizarBotoes}
                </div>
            </td>
        `;

        tabelaCorpo.appendChild(linha);
    });
}

async function cancelarAgendamento(id) {

    const confirmar = await customConfirm("Tem certeza que deseja cancelar este agendamento?");

    if (!confirmar) return;

    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://localhost:8080/api/agendamentos/${id}`, {
            method: "DELETE",
            headers: {"Authorization": `Bearer ${token}`}
        });

        if (response.ok) {
            mostrarNotificacao("Agendamento cancelado com sucesso!", "sucesso");
            filtrarAgendamentos(filtroAtual);
        } else {
            mostrarNotificacao("Não foi possível cancelar o agendamento.", "erro");
        }
    } catch (error) {
        console.error("Erro ao deletar:", error);
        mostrarNotificacao("Ocorreu um erro ao tentar cancelar o agendamento.", "erro");
    }
}


