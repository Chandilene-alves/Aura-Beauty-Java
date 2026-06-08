package com.aurabeauty.agendamentos.controller;

import com.aurabeauty.agendamentos.dto.DadosAgendamento;
import com.aurabeauty.agendamentos.dto.DadosAtualizacaoAgendamento;
import com.aurabeauty.agendamentos.dto.DadosDetalhamentoAgendamento;
import com.aurabeauty.agendamentos.model.Agendamento;
import com.aurabeauty.agendamentos.model.Servico;
import com.aurabeauty.agendamentos.model.StatusAgendamento;
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
        if (repository.existsByDataHoraAndStatusNot(dados.data(), StatusAgendamento.CANCELADO)) {
            return ResponseEntity.badRequest()
                    .body("Já existe um serviço agendamento para este dia e horário!");
        }

        var servico = servicoRepository.getReferenceById(dados.idServico());
        var agendamento = new Agendamento(dados, servico);

        repository.save(agendamento);

        return ResponseEntity.ok("Agendamento de " + dados.cliente() + " realizado com sucesso!");
    }

    @GetMapping
    public ResponseEntity<List<DadosDetalhamentoAgendamento>> listar() {
        var lista = repository.findAllByOrderByDataHoraAsc().stream()
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

        var lista = repository.findAllByDataHoraBetweenOrderByDataHoraAsc(inicioDia, fimDia).stream()
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

        var lista = repository.findAllByDataHoraBetweenOrderByDataHoraAsc(inicioPeriodo, fimPeriodo).stream()
                .map(DadosDetalhamentoAgendamento::new)
                .toList();

        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity editar(@PathVariable Long id){
        var agendamento = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        return ResponseEntity.ok(new DadosDetalhamentoAgendamento(agendamento));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity atualizar(@RequestBody @Valid DadosAtualizacaoAgendamento dados){
        if (repository.existsByDataHoraAndIdNotAndStatusNot(dados.data(), dados.id(), StatusAgendamento.CANCELADO)) {
            return ResponseEntity.badRequest()
                    .body("Não foi possível atualizar: Este dia e horário já estão reservados!");
        }

        var agendamento = repository.getReferenceById(dados.id());

        Servico novoServico = null;
        if (dados.idServico() != null) {
            novoServico = servicoRepository.getReferenceById(dados.idServico());
        }

        agendamento.atualizarInformacoes(dados, novoServico);

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
