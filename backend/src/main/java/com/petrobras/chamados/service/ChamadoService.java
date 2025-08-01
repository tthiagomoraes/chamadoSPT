package com.petrobras.chamados.service;

import com.petrobras.chamados.dto.ChamadoRequestDTO;
import com.petrobras.chamados.dto.ChamadoResponseDTO;
import com.petrobras.chamados.dto.DashboardStatsDTO;
import com.petrobras.chamados.entity.Chamado;
import com.petrobras.chamados.exception.BusinessException;
import com.petrobras.chamados.exception.ResourceNotFoundException;
import com.petrobras.chamados.repository.ChamadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class ChamadoService {

    @Autowired
    private ChamadoRepository chamadoRepository;

    @Transactional(readOnly = true)
    public List<ChamadoResponseDTO> findAll() {
        return chamadoRepository.findAllOrderByUltimaAtualizacaoDesc()
                .stream()
                .map(ChamadoResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ChamadoResponseDTO findById(Long id) {
        Chamado chamado = chamadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chamado não encontrado com ID: " + id));
        return new ChamadoResponseDTO(chamado);
    }

    public ChamadoResponseDTO create(ChamadoRequestDTO requestDTO) {
        if (chamadoRepository.existsByNumero(requestDTO.getNumero())) {
            throw new BusinessException("Já existe um chamado com este número: " + requestDTO.getNumero());
        }

        Chamado chamado = new Chamado();
        chamado.setNumero(requestDTO.getNumero());
        chamado.setPrioridade(requestDTO.getPrioridadeEnum());
        chamado.setAbertoPor(requestDTO.getAbertoPor());
        chamado.setResponsavel(requestDTO.getResponsavel());
        chamado.setDescricaoResumida(requestDTO.getDescricaoResumida());
        chamado.setStatus(requestDTO.getStatusEnum());

        Chamado savedChamado = chamadoRepository.save(chamado);
        return new ChamadoResponseDTO(savedChamado);
    }

    public ChamadoResponseDTO update(Long id, ChamadoRequestDTO requestDTO) {
        Chamado chamado = chamadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chamado não encontrado com ID: " + id));

        if (chamadoRepository.existsByNumeroAndIdNot(requestDTO.getNumero(), id)) {
            throw new BusinessException("Já existe um chamado com este número: " + requestDTO.getNumero());
        }

        chamado.setNumero(requestDTO.getNumero());
        chamado.setPrioridade(requestDTO.getPrioridadeEnum());
        chamado.setAbertoPor(requestDTO.getAbertoPor());
        chamado.setResponsavel(requestDTO.getResponsavel());
        chamado.setDescricaoResumida(requestDTO.getDescricaoResumida());
        chamado.setStatus(requestDTO.getStatusEnum());

        Chamado updatedChamado = chamadoRepository.save(chamado);
        return new ChamadoResponseDTO(updatedChamado);
    }

    public void delete(Long id) {
        if (!chamadoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Chamado não encontrado com ID: " + id);
        }
        chamadoRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats() {
        long total = chamadoRepository.count();
        long alta = chamadoRepository.countByPrioridade(Chamado.Prioridade.ALTA);
        long moderada = chamadoRepository.countByPrioridade(Chamado.Prioridade.MODERADA);
        long baixa = chamadoRepository.countByPrioridade(Chamado.Prioridade.BAIXA);

        long emAberto = chamadoRepository.countEmAberto(Chamado.Status.ABERTO, Chamado.Status.EM_ANDAMENTO);
        
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        long resolvidosHoje = chamadoRepository.countResolvidosHoje(Chamado.Status.RESOLVIDO, startOfDay, endOfDay);

        Map<String, DashboardStatsDTO.PrioridadeStatsDTO> distribuicaoPrioridade = new HashMap<>();
        if (total > 0) {
            distribuicaoPrioridade.put("alta", 
                new DashboardStatsDTO.PrioridadeStatsDTO(alta, (int) Math.round((alta * 100.0) / total)));
            distribuicaoPrioridade.put("moderada", 
                new DashboardStatsDTO.PrioridadeStatsDTO(moderada, (int) Math.round((moderada * 100.0) / total)));
            distribuicaoPrioridade.put("baixa", 
                new DashboardStatsDTO.PrioridadeStatsDTO(baixa, (int) Math.round((baixa * 100.0) / total)));
        } else {
            // Quando não há chamados, ainda assim retorna a estrutura esperada
            distribuicaoPrioridade.put("alta", new DashboardStatsDTO.PrioridadeStatsDTO(0, 0));
            distribuicaoPrioridade.put("moderada", new DashboardStatsDTO.PrioridadeStatsDTO(0, 0));
            distribuicaoPrioridade.put("baixa", new DashboardStatsDTO.PrioridadeStatsDTO(0, 0));
        }

        List<ChamadoResponseDTO> chamadosRecentes = chamadoRepository.findAllOrderByDataAberturaDesc()
                .stream()
                .limit(5)
                .map(ChamadoResponseDTO::new)
                .collect(Collectors.toList());

        return new DashboardStatsDTO(total, emAberto, alta, moderada, baixa, 
                                   resolvidosHoje, distribuicaoPrioridade, chamadosRecentes);
    }

    @Transactional(readOnly = true)
    public List<ChamadoResponseDTO> findWithFilters(String prioridade, String responsavel, 
                                                   String abertoPor, String dataInicio, String dataFim) {
        // Começar com todos os chamados
        List<Chamado> chamados = chamadoRepository.findAllOrderByUltimaAtualizacaoDesc();
        
        // Aplicar filtros programaticamente
        return chamados.stream()
                .filter(c -> prioridade == null || prioridade.trim().isEmpty() || 
                            c.getPrioridade().name().equalsIgnoreCase(prioridade))
                .filter(c -> responsavel == null || responsavel.trim().isEmpty() || 
                            c.getResponsavel().toLowerCase().contains(responsavel.toLowerCase()))
                .filter(c -> abertoPor == null || abertoPor.trim().isEmpty() || 
                            c.getAbertoPor().toLowerCase().contains(abertoPor.toLowerCase()))
                .filter(c -> {
                    if (dataInicio == null || dataInicio.trim().isEmpty()) return true;
                    try {
                        LocalDate date = LocalDate.parse(dataInicio);
                        return c.getDataAbertura().toLocalDate().isAfter(date.minusDays(1));
                    } catch (Exception e) {
                        return true;
                    }
                })
                .filter(c -> {
                    if (dataFim == null || dataFim.trim().isEmpty()) return true;
                    try {
                        LocalDate date = LocalDate.parse(dataFim);
                        return c.getDataAbertura().toLocalDate().isBefore(date.plusDays(1));
                    } catch (Exception e) {
                        return true;
                    }
                })
                .map(ChamadoResponseDTO::new)
                .collect(Collectors.toList());
    }
}