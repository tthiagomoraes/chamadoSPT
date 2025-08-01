package com.petrobras.chamados.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "chamados")
public class Chamado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Número do chamado é obrigatório")
    @Column(unique = true, nullable = false)
    private String numero;

    @NotNull(message = "Prioridade é obrigatória")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Prioridade prioridade;

    @NotBlank(message = "Campo 'Aberto Por' é obrigatório")
    @Column(name = "aberto_por", nullable = false)
    private String abertoPor;

    @NotBlank(message = "Responsável é obrigatório")
    @Column(nullable = false)
    private String responsavel;

    @Column(name = "data_abertura", nullable = false)
    private LocalDateTime dataAbertura;

    @Column(name = "ultima_atualizacao", nullable = false)
    private LocalDateTime ultimaAtualizacao;

    @NotBlank(message = "Descrição é obrigatória")
    @Column(name = "descricao_resumida", nullable = false, length = 1000)
    private String descricaoResumida;

    @NotNull(message = "Status é obrigatório")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(name = "data_resolucao")
    private LocalDateTime dataResolucao;

    public enum Prioridade {
        BAIXA, MODERADA, ALTA
    }

    public enum Status {
        ABERTO, EM_ANDAMENTO, RESOLVIDO, CANCELADO
    }

    public Chamado() {
        this.dataAbertura = LocalDateTime.now();
        this.ultimaAtualizacao = LocalDateTime.now();
        this.status = Status.ABERTO;
    }

    public Chamado(String numero, Prioridade prioridade, String abertoPor, String responsavel, String descricaoResumida) {
        this();
        this.numero = numero;
        this.prioridade = prioridade;
        this.abertoPor = abertoPor;
        this.responsavel = responsavel;
        this.descricaoResumida = descricaoResumida;
    }

    @PreUpdate
    public void preUpdate() {
        this.ultimaAtualizacao = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public Prioridade getPrioridade() {
        return prioridade;
    }

    public void setPrioridade(Prioridade prioridade) {
        this.prioridade = prioridade;
    }

    public String getAbertoPor() {
        return abertoPor;
    }

    public void setAbertoPor(String abertoPor) {
        this.abertoPor = abertoPor;
    }

    public String getResponsavel() {
        return responsavel;
    }

    public void setResponsavel(String responsavel) {
        this.responsavel = responsavel;
    }

    public LocalDateTime getDataAbertura() {
        return dataAbertura;
    }

    public void setDataAbertura(LocalDateTime dataAbertura) {
        this.dataAbertura = dataAbertura;
    }

    public LocalDateTime getUltimaAtualizacao() {
        return ultimaAtualizacao;
    }

    public void setUltimaAtualizacao(LocalDateTime ultimaAtualizacao) {
        this.ultimaAtualizacao = ultimaAtualizacao;
    }

    public String getDescricaoResumida() {
        return descricaoResumida;
    }

    public void setDescricaoResumida(String descricaoResumida) {
        this.descricaoResumida = descricaoResumida;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
        if (status == Status.RESOLVIDO && this.dataResolucao == null) {
            this.dataResolucao = LocalDateTime.now();
        }
    }

    public LocalDateTime getDataResolucao() {
        return dataResolucao;
    }

    public void setDataResolucao(LocalDateTime dataResolucao) {
        this.dataResolucao = dataResolucao;
    }
}