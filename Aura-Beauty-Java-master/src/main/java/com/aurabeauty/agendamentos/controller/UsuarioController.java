package com.aurabeauty.agendamentos.controller;

import com.aurabeauty.agendamentos.dto.DadosCadastroUsuario;
import com.aurabeauty.agendamentos.model.Usuario;
import com.aurabeauty.agendamentos.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@CrossOrigin(origins = "*")
@RequestMapping("/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public String exibirCriarConta() {
        return "criarconta";
    }

    @PostMapping("/api")
    @ResponseBody
    @Transactional
    public ResponseEntity cadastrar(@RequestBody @Valid DadosCadastroUsuario dados) {

        if (!dados.senha().equals(dados.confirmarSenha())) {
            return ResponseEntity.badRequest().body("Erro: As senhas digitadas não são iguais!");
        }

        String senhaCriptografada = passwordEncoder.encode(dados.senha());

        var usuario = new Usuario(dados.nome(), dados.email(), senhaCriptografada, dados.cargo());
        repository.save(usuario);

        return ResponseEntity.ok("Usuário cadastrado com sucesso!");
    }


}
