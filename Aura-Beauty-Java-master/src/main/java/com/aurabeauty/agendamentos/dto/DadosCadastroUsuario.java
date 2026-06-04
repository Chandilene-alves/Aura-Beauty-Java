package com.aurabeauty.agendamentos.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record DadosCadastroUsuario(
        @NotBlank String nome,
        @NotBlank @Email String email,
        @NotBlank String cargo,
        @NotBlank String senha,
        @NotBlank String confirmarSenha) {
}
