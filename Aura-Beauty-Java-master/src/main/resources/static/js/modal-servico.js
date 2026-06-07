document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cadastro-servico");
  if (form) {
    form.addEventListener("submit", salvarServico);
  }
});

async function salvarServico(event) {
  event.preventDefault();


  const nome = document.getElementById("nome").value;
  const descricaoCurta = document.getElementById("descricaoCurta").value;
  const duracaoMinutos = parseInt(document.getElementById("duracaoMinutos").value);
  const preco = parseFloat(document.getElementById("preco").value);


  const novoServico = {
    nome: nome,
    descricaoCurta: descricaoCurta,
    duracaoMinutos: duracaoMinutos,
    preco: preco
  };

  try {

    const response = await fetch('/api/servicos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`

      },
      body: JSON.stringify(novoServico)
    });


    if (response.ok) {
      alert("Serviço cadastrado com sucesso! 🎉");
      fecharModal();


      if (typeof carregarServicos === 'function') {
        carregarServicos();
      } else {
        window.location.reload();
      }
    } else {
      throw new Error("Erro ao salvar o serviço no servidor.");
    }

  } catch (error) {
    console.error("Erro na requisição POST:", error);
    alert("Não foi possível cadastrar o serviço. Verifique os dados ou o console.");
  }
}





function abrirModal() {
  const modal = document.getElementById("modal-servico");
  modal.style.display = "flex";
}

function fecharModal() {
  const modal = document.getElementById("modal-servico");
  modal.style.display = "none";
  document.getElementById("form-cadastro-servico").reset(); // Limpa os campos preenchidos
}