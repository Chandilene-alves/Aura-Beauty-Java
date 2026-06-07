package com.aurabeauty.agendamentos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record DadosAtualizacaoAgendamento(
        @NotNull Long id,
         String cliente,
         Long idServico,
         String profissional,
        LocalDateTime data
) {
}
