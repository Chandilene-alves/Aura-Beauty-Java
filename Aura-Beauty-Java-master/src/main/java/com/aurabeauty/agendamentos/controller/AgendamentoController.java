package com.aurabeauty.agendamentos.controller;

import com.aurabeauty.agendamentos.dto.DadosAgendamento;
import com.aurabeauty.agendamentos.dto.DadosAtualizacaoAgendamento;
import com.aurabeauty.agendamentos.dto.DadosDetalhamentoAgendamento;
import com.aurabeauty.agendamentos.model.Agendamento;
import com.aurabeauty.agendamentos.repository.AgendamentoRepository;
import com.aurabeauty.agendamentos.repository.ServicoRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

    @Autowired
    private AgendamentoRepository repository;
    @Autowired
    private ServicoRepository servicoRepository;

    @PostMapping
    @Transactional
    public ResponseEntity agendar(@RequestBody @Valid DadosAgendamento dados) {
        var servico = servicoRepository.getReferenceById(dados.idServico());
        var agendamento = new Agendamento(dados, servico);

        repository.save(agendamento);

        return ResponseEntity.ok("Agendamento de " + dados.cliente() + " realizado com sucesso!");
    }

    @GetMapping
    public ResponseEntity<List<DadosDetalhamentoAgendamento>> listar() {
        var lista = repository.findAll().stream()
                .map(DadosDetalhamentoAgendamento::new)
                .toList();

        return ResponseEntity.ok(lista);
    }

    @GetMapping("/por-data")
    public ResponseEntity<?> listarPorData(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data
    ) {

        var inicioDia = data.atStartOfDay();
        var fimDia = data.atTime(LocalTime.MAX);

        var lista = repository.findAllByDataHoraBetween(inicioDia, fimDia).stream()
                .map(DadosDetalhamentoAgendamento::new)
                .toList();

        if (lista.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        return ResponseEntity.ok(lista);
    }

    @GetMapping("/periodo")
    public ResponseEntity<List<DadosDetalhamentoAgendamento>> listarPorPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim
    ) {
        var inicioPeriodo = inicio.atStartOfDay();
        var fimPeriodo = fim.atTime(LocalTime.MAX);

        var lista = repository.findAllByDataHoraBetween(inicioPeriodo, fimPeriodo).stream()
                .map(DadosDetalhamentoAgendamento::new)
                .toList();

        return ResponseEntity.ok(lista);
    }

    @PutMapping
    @Transactional
    public ResponseEntity atualizar(@RequestBody @Valid DadosAtualizacaoAgendamento dados){
        var agendamento = repository.getReferenceById(dados.id());

        if(dados.idServico() != null){
            var novoServico = servicoRepository.getReferenceById(dados.idServico());
            agendamento.atualizarInformacoes(dados, novoServico);
        }else{
            agendamento.atualizarInformacoes(dados, null);
        }

        return ResponseEntity.ok(new DadosDetalhamentoAgendamento(agendamento));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity excluir(@PathVariable Long id) {

        var agendamento = repository.getReferenceById(id);


        agendamento.cancelar();

        return ResponseEntity.noContent().build();
    }
}
