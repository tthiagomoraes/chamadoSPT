package com.petrobras.chamados.dto;

import com.petrobras.chamados.entity.Chamado;


public class ChamadoResponseDTO {
    private Long id;
    private String numero;
    private String prioridade;
    private String abertoPor;
    private String responsavel;
    private String dataAbertura;
    private String ultimaAtualizacao;
    private String descricaoResumida;
    private String status;
    private String dataResolucao;

    public ChamadoResponseDTO() {}

    public ChamadoResponseDTO(Chamado chamado) {
        this.id = chamado.getId();
        this.numero = chamado.getNumero();
        this.prioridade = chamado.getPrioridade().name();
        this.abertoPor = chamado.getAbertoPor();
        this.responsavel = chamado.getResponsavel();
        this.dataAbertura = chamado.getDataAbertura().toString();
        this.ultimaAtualizacao = chamado.getUltimaAtualizacao().toString();
        this.descricaoResumida = chamado.getDescricaoResumida();
        this.status = chamado.getStatus().name();
        this.dataResolucao = chamado.getDataResolucao() != null ? chamado.getDataResolucao().toString() : null;
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

    public String getPrioridade() {
        return prioridade;
    }

    public void setPrioridade(String prioridade) {
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

    public String getDataAbertura() {
        return dataAbertura;
    }

    public void setDataAbertura(String dataAbertura) {
        this.dataAbertura = dataAbertura;
    }

    public String getUltimaAtualizacao() {
        return ultimaAtualizacao;
    }

    public void setUltimaAtualizacao(String ultimaAtualizacao) {
        this.ultimaAtualizacao = ultimaAtualizacao;
    }

    public String getDescricaoResumida() {
        return descricaoResumida;
    }

    public void setDescricaoResumida(String descricaoResumida) {
        this.descricaoResumida = descricaoResumida;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDataResolucao() {
        return dataResolucao;
    }

    public void setDataResolucao(String dataResolucao) {
        this.dataResolucao = dataResolucao;
    }
}