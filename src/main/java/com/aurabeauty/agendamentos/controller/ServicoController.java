package com.aurabeauty.agendamentos.controller;

import com.aurabeauty.agendamentos.dto.DadosAtualizacaoServico;
import com.aurabeauty.agendamentos.dto.DadosCadastroServico;
import com.aurabeauty.agendamentos.dto.DadosListagemServico;
import com.aurabeauty.agendamentos.model.Servico;
import com.aurabeauty.agendamentos.repository.ServicoRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/servicos")
public class ServicoController {
    @Autowired
    private ServicoRepository repository;

    @PostMapping
    @Transactional
    public ResponseEntity cadastrar(@RequestBody @Valid DadosCadastroServico dados){
        var servico = new Servico();
        servico.setNome(dados.nome());
        servico.setDescricaoCurta(dados.descricaoCurta());
        servico.setDuracaoMinutos(dados.duracaoMinutos());
        servico.setPreco(dados.preco());

        repository.save(servico);
        return ResponseEntity.ok("Serviço '" + dados.nome() + "' cadastrado com sucesso!");
    }

    @GetMapping
    @Transactional
    public ResponseEntity<List<DadosListagemServico>> listar(){
        var servicos = repository.findAll().stream()
                .map(DadosListagemServico::new)
                .toList();
        return ResponseEntity.ok(servicos);
    }

    @PutMapping
    @Transactional
    public ResponseEntity atualizar(@RequestBody @Valid DadosAtualizacaoServico dados){
        var servico = repository.getReferenceById(dados.id());

        if(dados.nome() != null) servico.setNome(dados.nome());
        if(dados.descricaoCurta() != null) servico.setDescricaoCurta(dados.descricaoCurta());
        if(dados.duracaoMinutos() != null) servico.setDuracaoMinutos(dados.duracaoMinutos());
        if(dados.preco() != null) servico.setPreco(dados.preco());

        return ResponseEntity.ok(new DadosListagemServico(servico));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity excluir(@PathVariable Long id){
        var servico = repository.getReferenceById(id);

        servico.excluir();

        return ResponseEntity.noContent().build();
    }
}
