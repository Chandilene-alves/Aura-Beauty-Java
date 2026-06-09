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
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@CrossOrigin(origins = "*")
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @GetMapping
    public String exibirLogin() {
        return "login";
    }
    @PostMapping("/api")
    @ResponseBody
    public ResponseEntity efetuarLogin(@RequestBody @Valid DadosAutenticacao dados) {

        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.email(), dados.senha());


        var authentication = manager.authenticate(authenticationToken);
        var usuario = (Usuario) authentication.getPrincipal();
        var tokenJWT = tokenService.gerarToken((Usuario) authentication.getPrincipal());


        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT, usuario.getNome(), usuario.getPerfil().name()));
    }
}