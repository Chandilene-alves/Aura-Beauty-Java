package com.aurabeauty.agendamentos.model;

import com.aurabeauty.agendamentos.dto.DadosAtualizacaoServico;
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
    @Column(name = "id_servico")
    private Long id;

    @Column(name = "nome_servico")
    private String nome;

    @Column(name = "descricao_curta")
    private String descricaoCurta;

    @Column(name = "duracao_minutos")
    private Integer duracaoMinutos;

    private BigDecimal preco;
    @Column(nullable = false)
    private Boolean ativo= true;


    public void atualizarInformacoes(DadosAtualizacaoServico dados) {
        if (dados.nome() != null) {
            this.nome = dados.nome();
        }
        if (dados.descricaoCurta() != null) {
            this.descricaoCurta = dados.descricaoCurta();
        }
        if (dados.duracaoMinutos() != null) {
            this.duracaoMinutos = dados.duracaoMinutos();
        }
        if (dados.preco() != null) {
            this.preco = dados.preco();
        }
    }

    public void excluir() {
        this.ativo = false;
    }
}
