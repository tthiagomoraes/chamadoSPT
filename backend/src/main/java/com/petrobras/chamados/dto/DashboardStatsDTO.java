package com.petrobras.chamados.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDTO {
    private long total;
    private long emAberto;
    private long alta;
    private long moderada;
    private long baixa;
    private long resolvidosHoje;
    private Map<String, PrioridadeStatsDTO> distribuicaoPrioridade;
    private List<ChamadoResponseDTO> chamadosRecentes;

    public DashboardStatsDTO() {}

    public DashboardStatsDTO(long total, long emAberto, long alta, long moderada, long baixa, 
                           long resolvidosHoje, Map<String, PrioridadeStatsDTO> distribuicaoPrioridade, 
                           List<ChamadoResponseDTO> chamadosRecentes) {
        this.total = total;
        this.emAberto = emAberto;
        this.alta = alta;
        this.moderada = moderada;
        this.baixa = baixa;
        this.resolvidosHoje = resolvidosHoje;
        this.distribuicaoPrioridade = distribuicaoPrioridade;
        this.chamadosRecentes = chamadosRecentes;
    }

    public static class PrioridadeStatsDTO {
        private long count;
        private int percentage;

        public PrioridadeStatsDTO() {}

        public PrioridadeStatsDTO(long count, int percentage) {
            this.count = count;
            this.percentage = percentage;
        }

        public long getCount() {
            return count;
        }

        public void setCount(long count) {
            this.count = count;
        }

        public int getPercentage() {
            return percentage;
        }

        public void setPercentage(int percentage) {
            this.percentage = percentage;
        }
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public long getEmAberto() {
        return emAberto;
    }

    public void setEmAberto(long emAberto) {
        this.emAberto = emAberto;
    }

    public long getAlta() {
        return alta;
    }

    public void setAlta(long alta) {
        this.alta = alta;
    }

    public long getModerada() {
        return moderada;
    }

    public void setModerada(long moderada) {
        this.moderada = moderada;
    }

    public long getBaixa() {
        return baixa;
    }

    public void setBaixa(long baixa) {
        this.baixa = baixa;
    }

    public long getResolvidosHoje() {
        return resolvidosHoje;
    }

    public void setResolvidosHoje(long resolvidosHoje) {
        this.resolvidosHoje = resolvidosHoje;
    }

    public Map<String, PrioridadeStatsDTO> getDistribuicaoPrioridade() {
        return distribuicaoPrioridade;
    }

    public void setDistribuicaoPrioridade(Map<String, PrioridadeStatsDTO> distribuicaoPrioridade) {
        this.distribuicaoPrioridade = distribuicaoPrioridade;
    }

    public List<ChamadoResponseDTO> getChamadosRecentes() {
        return chamadosRecentes;
    }

    public void setChamadosRecentes(List<ChamadoResponseDTO> chamadosRecentes) {
        this.chamadosRecentes = chamadosRecentes;
    }
}