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




  const fecharModal = () => {
    modal.style.display = "none";
    if (form) form.reset();
    limparResumo();
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
          option.textContent = servico.nome || servico.nome;
          selectServico.appendChild(option);
        });
      }
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
    }
  }


  listaHorarios.forEach(li => {
    li.addEventListener("click", () => {
      listaHorarios.forEach(item => item.classList.remove("selected"));
      li.classList.add("selected");
      horarioSelecionado = li.textContent.trim();
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
      resumoServico.textContent = servicoSelecionado.nome || servicoSelecionado.nome;
      resumoTotal.textContent = `R$ ${servicoSelecionado.preco.toFixed(2).replace(".", ",")}`;
    } else {
      resumoServico.textContent = "-";
      resumoTotal.textContent = "R$ 0,00";
    }
  };

  inputCliente.addEventListener("input", atualizarResumo);
  inputProfissional.addEventListener("input", atualizarResumo);
  inputData.addEventListener("change", atualizarResumo);
  selectServico.addEventListener("change", atualizarResumo);

  function limparResumo() {
    resumoCliente.textContent = "-";
    resumoServico.textContent = "-";
    resumoProfissional.textContent = "-";
    resumoDataHora.textContent = "-";
    resumoTotal.textContent = "R$ 0,00";
    horarioSelecionado = "";
    listaHorarios.forEach(item => item.classList.remove("selected"));
  }


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

    try {
      const response = await fetch("http://localhost:8080/api/agendamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dadosAgendamento)
      });

      if (response.ok) {
        alert("Agendamento realizado com sucesso!");
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