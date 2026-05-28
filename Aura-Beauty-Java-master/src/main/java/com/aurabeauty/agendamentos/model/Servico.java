package com.aurabeauty.agendamentos.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Table(name = "servicos")
@Entity(name = "Servico")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Servico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_servico")
    private Long id;

    @Column(name = "nome_servico")
    private String nome;

    @Column(name = "descricao_curta")
    private String descricaoCurta;

    @Column(name = "duracao_minutos")
    private Integer duracaoMinutos;

    private BigDecimal preco;

    private Boolean ativo;

    public void excluir() {
        this.ativo = false;
    }
}
