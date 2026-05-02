package com.aurabeauty.agendamentos.repository;

import com.aurabeauty.agendamentos.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    List<Agendamento> findAllByDataHoraBetween(LocalDateTime inicio, LocalDateTime fim);
}