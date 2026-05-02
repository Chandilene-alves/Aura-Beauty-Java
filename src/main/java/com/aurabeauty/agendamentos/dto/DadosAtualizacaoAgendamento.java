package com.aurabeauty.agendamentos.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record DadosAtualizacaoAgendamento(
        @NotNull Long id,
        String profissional,
        LocalDateTime data,
        Long idServico
) {
}
