package com.aurabeauty.agendamentos.controller;

import com.aurabeauty.agendamentos.dto.DadosAutenticacao;
import com.aurabeauty.agendamentos.dto.DadosTokenJWT;
import com.aurabeauty.agendamentos.model.Usuario;
import com.aurabeauty.agendamentos.service.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @PostMapping("")
    public ResponseEntity efetuarLogin(@RequestBody @Valid DadosAutenticacao dados) {
        // Cria o token de autenticação do Spring com os dados vindos do DTO
        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.email(), dados.senha());

        // O Manager chama o seu AutenticacaoService e compara a senha criptografada
        var authentication = manager.authenticate(authenticationToken);

        // Se a autenticação passar, gera o Token JWT
        var tokenJWT = tokenService.gerarToken((Usuario) authentication.getPrincipal());

        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));
    }
}