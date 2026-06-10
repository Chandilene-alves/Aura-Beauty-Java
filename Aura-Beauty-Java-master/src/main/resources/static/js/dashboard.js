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

    const pilulas = document.querySelectorAll(".btn-pill");
    pilulas.forEach(pilula => {
        pilula.addEventListener("click", (e) => {
            // Remove a classe active de todas as pílulas
            pilulas.forEach(p => p.classList.remove("active"));

            // Adiciona a classe active na pílula clicada
            e.currentTarget.classList.add("active");

            // Atualiza os textos contextuais dos cards
            atualizarLabelsCards(e.currentTarget.getAttribute("data-periodo"));

            // Recarrega todos os dados com o novo filtro aplicado
            loadAllData();
        });
    });

    loadAllData();
});

const API_URL = "http://localhost:8080";
const ctx = document.getElementById("chart");
let meuGraficoInstance = null;

const brandColors = [
    "#0d2b2a", "#1b4342", "#2a5c5a", "#3d7a77", "#4f9490", "#6aafab",
    "#7a5a20", "#9a7535", "#c5a059", "#cba547", "#d4b47a", "#e8c88a",
    "#2d7a4f", "#4a9e6e", "#81c784", "#b5ddb7", "#a89000", "#d4b800",
    "#f2d960", "#f7e898"
];


const atualizarLabelsCards = (opcao) => {
    const txtTitulo = document.getElementById("appointments-title");
    const txtDescricaoVendas = document.getElementById("sales-description");

    if (opcao === "hoje") {
        if (txtTitulo) txtTitulo.textContent = "Agendamentos Hoje";
        if (txtDescricaoVendas) txtDescricaoVendas.textContent = "Valor acumulado do dia";
    } else if (opcao === "semana") {
        if (txtTitulo) txtTitulo.textContent = "Agendamentos na Semana";
        if (txtDescricaoVendas) txtDescricaoVendas.textContent = "Valor acumulado na semana";
    } else if (opcao === "mes") {
        if (txtTitulo) txtTitulo.textContent = "Agendamentos no Mês";
        if (txtDescricaoVendas) txtDescricaoVendas.textContent = "Valor acumulado no mês";
    }
};

const formatarDataBR = (data) => {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
};

const calcularIntervaloDatas = (opcao) => {
    const hoje = new Date();
    let inicio = formatarDataBR(hoje);
    let fim = inicio;

    if (opcao === "semana") {
        const diaSemana = hoje.getDay();
        const diferencaSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;

        const segundaFeira = new Date(hoje);
        segundaFeira.setDate(hoje.getDate() + diferencaSegunda);

        const domingo = new Date(segundaFeira);
        domingo.setDate(segundaFeira.getDate() + 6);

        inicio = formatarDataBR(segundaFeira);
        fim = formatarDataBR(domingo);
    } else if (opcao === "mes") {
        const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

        inicio = formatarDataBR(primeiroDia);
        fim = formatarDataBR(ultimoDia);
    }

    return {inicio, fim};
};

const loadAppointments = async () => {
    try {
        const token = localStorage.getItem("token");

        // 🌟 Captura qual botão pílula está com a classe .active no momento
        const activePill = document.querySelector(".btn-pill.active");
        const filtro = activePill ? activePill.getAttribute("data-periodo") : "hoje";

        const {inicio, fim} = calcularIntervaloDatas(filtro);

        const response = await fetch(
            `${API_URL}/api/agendamentos/periodo?inicio=${inicio}&fim=${fim}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            },
        );

        if (!response.ok) {
            throw new Error("Failed to fetch appointments");
        }

        const data = await response.json();
        return data.filter((apt) => apt.status === "AGENDADO");
    } catch (error) {
        console.error("Error loading appointments:", error);
        return [];
    }
};

const loadServices = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/servicos`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch services");
        }

        return await response.json();
    } catch (error) {
        console.error("Error loading services:", error);
        return [];
    }
};

const fillAppointmentsQuantity = (appointments) => {
    const quantity = appointments.length;
    const element = document.querySelector("#appointments-quantity");
    if (element) element.textContent = quantity;
};

const fillTotalSales = (appointments) => {
    const total = appointments.reduce((sum, appt) => sum + appt.valor, 0);
    const element = document.querySelector("#total-sales");
    if (element) {
        element.textContent = total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }
};

const createChart = (services, appointments) => {
    const serviceNames = [];
    const serviceCounts = [];

    for (let i = 0; i < appointments.length; i++) {
        const appointment = appointments[i];
        const {nomeServico} = appointment;

        const index = serviceNames.indexOf(nomeServico);
        if (index === -1) {
            serviceNames.push(nomeServico);
            serviceCounts.push(1);
        } else {
            serviceCounts[index]++;
        }
    }

    if (meuGraficoInstance) {
        meuGraficoInstance.destroy();
    }

    if (!ctx) return;

    meuGraficoInstance = new Chart(ctx, {
        type: "pie",
        data: {
            labels: serviceNames,
            datasets: [
                {
                    label: "",
                    data: serviceCounts,
                    backgroundColor: brandColors,
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {position: "right"},
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const value = context.parsed;
                            const percentage = ((value / total) * 100).toFixed(1);
                            return ` ${context.label}: ${percentage}% (${value})`;
                        },
                    },
                },
            },
        },
    });
};

const loadAllData = async () => {
    const appointments = await loadAppointments();
    const services = await loadServices();

    fillAppointmentsQuantity(appointments);
    fillTotalSales(appointments);
    createChart(services, appointments);
};