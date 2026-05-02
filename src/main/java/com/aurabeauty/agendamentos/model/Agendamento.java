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

        private BigDecimal valor; // Para o "Total R$ 150,00"

        @Enumerated(EnumType.STRING) // Salva o nome (ex: "AGENDADO") no banco
        private StatusAgendamento status = StatusAgendamento.AGENDADO;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "id_servico") // Nome da coluna FK no banco
        private Servico servico;

        public Agendamento(DadosAgendamento dados, Servico servico) {
                this.cliente = dados.cliente();
                this.servico = servico;
                this.profissional = dados.profissional();
                this.dataHora = dados.data();
                this.valor = servico.getPreco(); // Aqui a mágica acontece!
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
                        this.valor = novoServico.getPreco(); // Se mudar o serviço, o preço atualiza!
                }
        }
    }

