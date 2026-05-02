package com.aurabeauty.agendamentos.dto;

import com.aurabeauty.agendamentos.model.Agendamento;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DadosDetalhamentoAgendamento(
        Long id,
        String cliente,
        String profissional,
        LocalDateTime data,
        BigDecimal valor,
        // Aqui trazemos os dados da tabela de serviço
        String nomeServico,
        Integer duracao
) {
    public DadosDetalhamentoAgendamento(Agendamento agendamento) {
        this(
                agendamento.getId(),
                agendamento.getCliente(),
                agendamento.getProfissional(),
                agendamento.getDataHora(),
                agendamento.getValor(),
                agendamento.getServico().getNome(), // Busca da tabela relacionada
                agendamento.getServico().getDuracaoMinutos() // Busca da tabela relacionada
        );
    }
}
