package com.aurabeauty.agendamentos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DadosAgendamento(
        @NotBlank String cliente,
        @NotNull Long idServico,
        @NotBlank String profissional,
        @NotNull LocalDateTime data

) {
}
