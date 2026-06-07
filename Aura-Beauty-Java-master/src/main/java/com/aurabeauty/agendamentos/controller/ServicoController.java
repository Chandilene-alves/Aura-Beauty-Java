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
@RequestMapping("api/servicos")
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
        var servicos = repository.findAllByAtivoTrue().stream()
                .map(DadosListagemServico::new)
                .toList();
        return ResponseEntity.ok(servicos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DadosListagemServico> detalhar(@PathVariable Long id) {

        var servico = repository.getReferenceById(id);


        return ResponseEntity.ok(new DadosListagemServico(servico));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity atualizar(@RequestBody @Valid DadosAtualizacaoServico dados){
        var servico = repository.getReferenceById(dados.id());
        servico.atualizarInformacoes(dados);

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
