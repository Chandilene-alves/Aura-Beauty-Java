package com.aurabeauty.agendamentos.dto;

import com.aurabeauty.agendamentos.model.PerfilUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DadosCadastroUsuario(
        @NotBlank String nome,
        @NotBlank @Email String email,
        @NotBlank String senha,
        @NotBlank String confirmarSenha, @NotNull PerfilUsuario perfil) {

}
