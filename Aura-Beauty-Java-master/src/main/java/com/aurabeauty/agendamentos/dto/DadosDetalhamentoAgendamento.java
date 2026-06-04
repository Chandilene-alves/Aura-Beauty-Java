package com.aurabeauty.agendamentos.dto;

import com.aurabeauty.agendamentos.model.Agendamento;
import com.aurabeauty.agendamentos.model.StatusAgendamento;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DadosDetalhamentoAgendamento(
        Long id,
        String cliente,
        String profissional,
        LocalDateTime data,
        BigDecimal valor,

        String nomeServico,
        Integer duracao,
        StatusAgendamento status
) {
    public DadosDetalhamentoAgendamento(Agendamento agendamento) {
        this(
                agendamento.getId(),
                agendamento.getCliente(),
                agendamento.getProfissional(),
                agendamento.getDataHora(),
                agendamento.getValor(),
                agendamento.getServico().getNome(),
                agendamento.getServico().getDuracaoMinutos(),
                agendamento.getStatus()
        );
    }
}
