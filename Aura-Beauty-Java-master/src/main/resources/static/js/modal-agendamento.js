document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const modal = document.getElementById("modal-agendamento");
  const btnNovo = document.querySelector(".btn-new-appointment");
  const btnFechar = document.getElementById("btn-fechar");
  const btnCancelar = document.getElementById("btn-cancelar");
  const form = document.getElementById("form-agendamento");

  const inputCliente = document.getElementById("modal-cliente");
  const selectServico = document.getElementById("modal-servico");
  const inputProfissional = document.getElementById("modal-profissional");
  const inputData = document.getElementById("modal-data");
  const listaHorarios = document.querySelectorAll("#modal-horarios li");

  const resumoCliente = document.getElementById("resumo-cliente");
  const resumoServico = document.getElementById("resumo-servico");
  const resumoProfissional = document.getElementById("resumo-profissional");
  const resumoDataHora = document.getElementById("resumo-data-hora");
  const resumoTotal = document.getElementById("resumo-total");

  let horarioSelecionado = "";
  let listaServicosObtidos = [];
  let agendamentoId = null;


  async function buscarHorariosOcupados() {
    const dataSelecionada = inputData.value;
    if (!dataSelecionada) return;

    try {
      const response = await fetch(`http://localhost:8080/api/agendamentos/por-data?data=${dataSelecionada}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const agendamentos = await response.json();

        const horasOcupadas = agendamentos
            .filter(apt => apt.status !== "CANCELADO" && apt.id !== agendamentoId)
            .map(apt => apt.data?.split("T")[1]?.substring(0, 5))
            .filter(hora => hora);

        listaHorarios.forEach(li => {
          const horaTextoLimpo = li.textContent.replace(" (Ocupado)", "").trim();

          if (horasOcupadas.includes(horaTextoLimpo)) {
            li.classList.add("disabled");
            if (!li.textContent.includes("(Ocupado)")) {
              li.textContent = `${horaTextoLimpo} (Ocupado)`;
            }

            if (li.classList.contains("selected")) {
              li.classList.remove("selected");
              horarioSelecionado = "";
              atualizarResumo();
            }
          } else {
            li.classList.remove("disabled");
            li.textContent = horaTextoLimpo;
          }
        });
      }
    } catch (error) {
      console.error("Erro ao buscar horários ocupados:", error);
    }
  }

  const fecharModal = () => {
    modal.style.display = "none";
    if (form) form.reset();
    limparResumo();

    agendamentoId = null;
    document.querySelector(".modal-header h2").textContent = "Novo Agendamento";
    form.querySelector("button[type='submit']").textContent = "Confirmar Agendamento";
  };

  if (btnNovo) {
    btnNovo.addEventListener("click", () => {
      modal.style.display = "flex";
      carregarServicosNoSelect();
    });
  }

  [btnFechar, btnCancelar].forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", fecharModal);
    }
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      fecharModal();
    }
  });

  async function carregarServicosNoSelect() {
    if (listaServicosObtidos.length > 0) return;

    try {
      const response = await fetch("http://localhost:8080/api/servicos", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        listaServicosObtidos = await response.json();

        selectServico.innerHTML = '<option value="">Selecione o serviço</option>';
        listaServicosObtidos.forEach(servico => {
          const option = document.createElement("option");
          option.value = servico.id;
          option.textContent = servico.nome;
          selectServico.appendChild(option);
        });
      }
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
    }
  }

  listaHorarios.forEach(li => {
    li.addEventListener("click", () => {
      // Proteção extra via JS caso o usuário clique em um item desabilitado
      if (li.classList.contains("disabled")) return;

      listaHorarios.forEach(item => item.classList.remove("selected"));
      li.classList.add("selected");
      horarioSelecionado = li.textContent.replace(" (Ocupado)", "").trim();
      atualizarResumo();
    });
  });

  const atualizarResumo = () => {
    resumoCliente.textContent = inputCliente.value || "-";
    resumoProfissional.textContent = inputProfissional.value || "-";

    const dataFormatada = inputData.value ? inputData.value.split("-").reverse().slice(0, 2).join("/") : "";
    resumoDataHora.textContent = dataFormatada || horarioSelecionado ? `${dataFormatada} - ${horarioSelecionado}h` : "-";

    const servicoSelecionado = listaServicosObtidos.find(s => s.id == selectServico.value);
    if (servicoSelecionado) {
      resumoServico.textContent = servicoSelecionado.nome;
      resumoTotal.textContent = `R$ ${servicoSelecionado.preco.toFixed(2).replace(".", ",")}`;
    } else {
      resumoServico.textContent = "-";
      resumoTotal.textContent = "R$ 0,00";
    }
  };

  inputCliente.addEventListener("input", atualizarResumo);
  inputProfissional.addEventListener("input", atualizarResumo);

  // 🌟 MODIFICADO: Quando mudar a data, atualiza o resumo E busca os horários ocupados
  inputData.addEventListener("change", () => {
    atualizarResumo();
    buscarHorariosOcupados();
  });

  selectServico.addEventListener("change", atualizarResumo);

  function limparResumo() {
    resumoCliente.textContent = "-";
    resumoServico.textContent = "-";
    resumoProfissional.textContent = "-";
    resumoDataHora.textContent = "-";
    resumoTotal.textContent = "R$ 0,00";
    horarioSelecionado = "";

    // 🌟 MODIFICADO: Reseta classes e textos limpos ao fechar a modal
    listaHorarios.forEach(item => {
      item.classList.remove("selected", "disabled");
      item.textContent = item.textContent.replace(" (Ocupado)", "").trim();
    });
  }

  window.editarAgendamento = async (id) => {
    agendamentoId = id;

    await carregarServicosNoSelect();

    try {
      const response = await fetch(`http://localhost:8080/api/agendamentos/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const agendamento = await response.json();
        console.log("Dados do agendamento carregados do banco:", agendamento);

        inputCliente.value = agendamento.cliente || "";
        inputProfissional.value = agendamento.profissional || "";

        const servicoEncontrado = listaServicosObtidos.find(s => s.nome === agendamento.nomeServico);
        selectServico.value = servicoEncontrado ? servicoEncontrado.id : "";

        const dataHora = new Date(agendamento.dataHora || agendamento.data);
        inputData.value = dataHora.toISOString().split('T')[0];

        // 🌟 NOVO: Busca e renderiza os bloqueios do dia da edição ANTES de marcar o selecionado
        await buscarHorariosOcupados();

        // Processa o horário para marcar na lista <ul> (Como já está em 09:00 no HTML, bate direto!)
        let horaInput = dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        horarioSelecionado = "";
        listaHorarios.forEach(li => {
          // Remove seleções antigas de reaberturas anteriores
          li.classList.remove("selected");
          if (li.textContent.replace(" (Ocupado)", "").trim() === horaInput) {
            li.classList.add("selected");
            horarioSelecionado = horaInput;
          }
        });

        document.querySelector(".modal-header h2").textContent = "Editar Agendamento";
        form.querySelector("button[type='submit']").textContent = "Salvar Alterações";

        atualizarResumo();
        modal.style.display = "flex";
      } else {
        alert("Erro ao carregar dados do agendamento.");
      }
    } catch (error) {
      console.error("Erro na requisição de edição:", error);
    }
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!horarioSelecionado) {
      alert("Por favor, selecione um horário!");
      return;
    }

    const dataHoraFormatada = `${inputData.value}T${horarioSelecionado}:00`;

    const dadosAgendamento = {
      cliente: inputCliente.value,
      profissional: inputProfissional.value,
      data: dataHoraFormatada,
      idServico: parseInt(selectServico.value)
    };

    if (agendamentoId) {
      dadosAgendamento.id = agendamentoId;
    }

    const url = agendamentoId
        ? `http://localhost:8080/api/agendamentos/${agendamentoId}`
        : "http://localhost:8080/api/agendamentos";

    const metodoHttp = agendamentoId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: metodoHttp,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dadosAgendamento)
      });

      if (response.ok) {
        alert(agendamentoId ? "Agendamento updated com sucesso!" : "Agendamento realizado com sucesso!");
        fecharModal();

        if (typeof carregarAgendamentosDoDia === "function") {
          carregarAgendamentosDoDia(token);
        } else {
          window.location.reload();
        }
      } else {
        const erro = await response.text();
        alert("Erro ao salvar agendamento: " + erro);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro de conexão com o servidor.");
    }
  });
});