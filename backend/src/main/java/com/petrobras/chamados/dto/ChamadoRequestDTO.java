package com.petrobras.chamados.dto;

import com.petrobras.chamados.entity.Chamado;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ChamadoRequestDTO {
    
    @NotNull(message = "Prioridade é obrigatória")
    private String prioridade;
    
    @NotBlank(message = "Número do chamado é obrigatório")
    private String numero;
    
    @NotBlank(message = "Campo 'Aberto Por' é obrigatório")
    private String abertoPor;
    
    @NotBlank(message = "Responsável é obrigatório")
    private String responsavel;
    
    @NotBlank(message = "Descrição é obrigatória")
    private String descricaoResumida;
    
    private String status; // Opcional, padrão será ABERTO

    public ChamadoRequestDTO() {}

    public ChamadoRequestDTO(String prioridade, String numero, String abertoPor, String responsavel, String descricaoResumida) {
        this.prioridade = prioridade;
        this.numero = numero;
        this.abertoPor = abertoPor;
        this.responsavel = responsavel;
        this.descricaoResumida = descricaoResumida;
    }

    public Chamado.Prioridade getPrioridadeEnum() {
        return Chamado.Prioridade.valueOf(this.prioridade.toUpperCase());
    }
    
    public Chamado.Status getStatusEnum() {
        if (this.status == null || this.status.trim().isEmpty()) {
            return Chamado.Status.ABERTO;
        }
        return Chamado.Status.valueOf(this.status.toUpperCase());
    }

    public String getPrioridade() {
        return prioridade;
    }

    public void setPrioridade(String prioridade) {
        this.prioridade = prioridade;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
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
}