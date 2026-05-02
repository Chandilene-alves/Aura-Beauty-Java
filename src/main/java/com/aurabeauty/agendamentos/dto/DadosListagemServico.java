package com.aurabeauty.agendamentos.dto;

import com.aurabeauty.agendamentos.model.Servico;

import java.math.BigDecimal;

public record DadosListagemServico(
        Long id,
        String nome,
        String descricaoCurta,
        Integer duracaoMinutos,
        BigDecimal preco
) {
    public DadosListagemServico(Servico servico){
        this(
                servico.getId(),
                servico.getNome(),
                servico.getDescricaoCurta(),
                servico.getDuracaoMinutos(),
                servico.getPreco()
        );
    }
}
