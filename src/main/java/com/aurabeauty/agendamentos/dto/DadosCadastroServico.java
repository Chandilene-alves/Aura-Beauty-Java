package com.aurabeauty.agendamentos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record DadosCadastroServico(
        @NotBlank String nome,
        String descricaoCurta,
        @NotNull Integer duracaoMinutos,
        @NotNull BigDecimal preco
) {
}
