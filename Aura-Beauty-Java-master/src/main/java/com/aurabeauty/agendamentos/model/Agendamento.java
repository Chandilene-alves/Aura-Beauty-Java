package com.aurabeauty.agendamentos.model;

import com.aurabeauty.agendamentos.dto.DadosAgendamento;
import com.aurabeauty.agendamentos.dto.DadosAtualizacaoAgendamento;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Table(name = "agendamentos")
@Entity(name = "Agendamento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")

public class Agendamento {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String cliente;
        private String profissional;

        @Column(name = "data_hora")
        private LocalDateTime dataHora;

        private BigDecimal valor;

        @Enumerated(EnumType.STRING)
        private StatusAgendamento status ;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "id_servico")
        private Servico servico;

        public Agendamento(DadosAgendamento dados, Servico servico) {
                this.cliente = dados.cliente();
                this.servico = servico;
                this.profissional = dados.profissional();
                this.dataHora = dados.data();
                this.valor = servico.getPreco();
                this.status = StatusAgendamento.AGENDADO;
        }

        // Dentro de Agendamento.java

        public void atualizarInformacoes(DadosAtualizacaoAgendamento dados, Servico novoServico) {
                if (dados.profissional() != null) {
                        this.profissional = dados.profissional();
                }
                if (dados.data() != null) {
                        this.dataHora = dados.data();
                }
                if (novoServico != null) {
                        this.servico = novoServico;
                        this.valor = novoServico.getPreco();
                }
        }

        public void cancelar() {

                this.status = StatusAgendamento.CANCELADO;
        }
    }

