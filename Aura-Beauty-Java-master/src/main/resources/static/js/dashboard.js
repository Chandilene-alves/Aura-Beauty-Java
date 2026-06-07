document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");


    const nomeUsuario = localStorage.getItem("nomeUsuario") || "Colaborador";
    const primeiroNome = nomeUsuario.split(" ")[0];

    if (!token) {
        alert("Acesso negado! Por favor, faça login.");
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

    let dia = new Date().toLocaleDateString('pt-BR', { weekday: "long" });
    dia = dia.charAt(0).toUpperCase() + dia.slice(1);

    const elementoDia = document.getElementById("dia-da-semana");
    if (elementoDia) {
        elementoDia.textContent = dia;
    }

});

const API_URL = "http://localhost:8080";

const ctx = document.getElementById("chart");

const brandColors = [
    "#0d2b2a", // teal muito escuro
    "#1b4342", // --aura-teal
    "#2a5c5a", // --aura-teal-light
    "#3d7a77", // teal médio
    "#4f9490", // teal claro
    "#6aafab", // teal suave
    "#7a5a20", // bronze escuro
    "#9a7535", // ouro escuro
    "#c5a059", // --aura-gold
    "#cba547", // --status-pending
    "#d4b47a", // ouro claro
    "#e8c88a", // ouro suave
    "#2d7a4f", // verde escuro
    "#4a9e6e", // verde médio
    "#81c784", // --status-confirmed
    "#b5ddb7", // verde claro
    "#a89000", // amarelo escuro
    "#d4b800", // amarelo médio
    "#f2d960", // --status-process
    "#f7e898", // amarelo claro
];

const loadAppointments = async () => {
    try {
        const token = localStorage.getItem("token");
        const date = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

        const response = await fetch(
            `${API_URL}/api/agendamentos/por-data?data=${date}`, // alterar pela data "date"
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
        const filteredData = data.filter((apt) => apt.status === "AGENDADO");

        return filteredData;
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

        const data = await response.json();

        return data;
    } catch (error) {
        console.error("Error loading services:", error);

        return [];
    }
};

const fillAppointmentsQuantity = (appointments) => {
    const quantity = appointments.length;
    const element = document.querySelector("#appointments-quantity");
    element.textContent = quantity;
};

const fillTotalSales = (appointments) => {
    const total = appointments.reduce((sum, appt) => sum + appt.valor, 0);
    const element = document.querySelector("#total-sales");
    element.textContent = `R$ ${total.toFixed(2)}`;
};

createChart = (services, appointments) => {
    const serviceNames = [];
    const serviceCounts = [];

    for (let i = 0; i < appointments.length; i++) {
        const appointment = appointments[i];
        const { nomeServico } = appointment;

        const index = serviceNames.indexOf(nomeServico);
        if (index === -1) {
            serviceNames.push(nomeServico);
            serviceCounts.push(1);
        } else {
            serviceCounts[index]++;
        }
    }

    new Chart(ctx, {
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
                legend: { position: "right" },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const value = context.parsed;
                            const percentage = ((value / total) * 100).toFixed(1);
                            return ` ${percentage}%`;
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

loadAllData();
