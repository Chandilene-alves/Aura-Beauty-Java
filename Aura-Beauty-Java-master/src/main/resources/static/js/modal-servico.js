let servicoId = null;

function abrirModal() {
  const modal = document.getElementById("modal-servico");
  if (modal) modal.style.display = "flex";
}

function fecharModal() {
  const modal = document.getElementById("modal-servico");
  if (modal) modal.style.display = "none";


  const form = document.getElementById("form-cadastro-servico");
  if (form) form.reset();


  servicoId = null;
  document.querySelector(".modal-header h2").textContent = "Cadastrar Novo Serviço";
  document.getElementById("form-cadastro-servico").querySelector("button[type='submit']").textContent = "Salvar Serviço";
}


window.editarServico = async (id) => {
  servicoId = id;
  try {

    const response = await fetch(`/api/servicos/${id}`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      const servico = await response.json();


      document.getElementById("nome").value = servico.nome;
      document.getElementById("descricaoCurta").value = servico.descricaoCurta || '';
      document.getElementById("duracaoMinutos").value = servico.duracaoMinutos;
      document.getElementById("preco").value = servico.preco;


      document.querySelector(".modal-header h2").textContent = "Editar Serviço";
      document.getElementById("form-cadastro-servico").querySelector("button[type='submit']").textContent = "Salvar Alterações";

      abrirModal();
    } else {
      alert("Erro ao carregar dados do serviço.");
    }
  } catch (error) {
    console.error("Erro na requisição de edição:", error);
  }
};


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cadastro-servico");
  const btnFechar = document.querySelector(".close-button");
  const btnCancelar = document.querySelector(".btn-cancelar");

  if (form) {

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const dadosServico = {
        nome: document.getElementById("nome").value,
        descricaoCurta: document.getElementById("descricaoCurta").value,
        duracaoMinutos: parseInt(document.getElementById("duracaoMinutos").value),
        preco: parseFloat(document.getElementById("preco").value)
      };


      if (servicoId) {
        dadosServico.id = servicoId;
      }

      const url = servicoId ? `/api/servicos/${servicoId}` : '/api/servicos';
      const metodoHttp = servicoId ? 'PUT' : 'POST';

      try {
        const response = await fetch(url, {
          method: metodoHttp,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(dadosServico)
        });

        if (response.ok) {
          alert(servicoId ? "Serviço atualizado com sucesso! ✨" : "Serviço cadastrado com sucesso! 🎉");
          fecharModal();


          if (typeof carregarServicos === 'function') {
            carregarServicos();
          } else {
            window.location.reload();
          }
        } else {
          alert("Erro ao salvar o serviço. Verifique as permissões ou os dados.");
        }
      } catch (error) {
        console.error("Erro ao enviar dados do serviço:", error);
      }
    });
  }


  [btnFechar, btnCancelar].forEach(btn => {
    if (btn) btn.addEventListener("click", fecharModal);
  });
});