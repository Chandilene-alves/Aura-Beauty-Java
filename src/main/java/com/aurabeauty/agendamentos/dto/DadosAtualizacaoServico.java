package com.aurabeauty.agendamentos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record DadosAtualizacaoServico(
        @NotNull Long id,
        String nome,
        String descricaoCurta,
        Integer duracaoMinutos,
        BigDecimal preco
) {}