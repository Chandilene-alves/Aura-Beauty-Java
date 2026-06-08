package com.aurabeauty.agendamentos.repository;
import com.aurabeauty.agendamentos.model.StatusAgendamento;

import com.aurabeauty.agendamentos.model.Agendamento;
import com.aurabeauty.agendamentos.model.StatusAgendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    List<Agendamento> findAllByDataHoraBetweenOrderByDataHoraAsc(LocalDateTime inicio, LocalDateTime fim);

    List<Agendamento> findAllByStatusNot(StatusAgendamento status);

    List<Agendamento> findAllByOrderByDataHoraAsc();

    boolean existsByDataHoraAndStatusNot(LocalDateTime dataHora, StatusAgendamento status);

    boolean existsByDataHoraAndIdNotAndStatusNot(LocalDateTime dataHora, Long id, StatusAgendamento status);
}