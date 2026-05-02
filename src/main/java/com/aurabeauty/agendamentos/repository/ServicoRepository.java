package com.aurabeauty.agendamentos.repository;

import com.aurabeauty.agendamentos.model.Servico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServicoRepository extends JpaRepository<Servico, Long> {
    List<Servico> findAllByAtivoTrue();
}
