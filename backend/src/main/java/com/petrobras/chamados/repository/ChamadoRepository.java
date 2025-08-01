package com.petrobras.chamados.repository;

import com.petrobras.chamados.entity.Chamado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChamadoRepository extends JpaRepository<Chamado, Long> {

    Optional<Chamado> findByNumero(String numero);
    
    boolean existsByNumero(String numero);
    
    boolean existsByNumeroAndIdNot(String numero, Long id);
    
    List<Chamado> findByPrioridade(Chamado.Prioridade prioridade);
    
    List<Chamado> findByResponsavelContainingIgnoreCase(String responsavel);
    
    List<Chamado> findByAbertoPorContainingIgnoreCase(String abertoPor);
    
    List<Chamado> findByDataAberturaBetween(LocalDateTime dataInicio, LocalDateTime dataFim);
    
    @Query("SELECT c FROM Chamado c WHERE " +
           "(:prioridade IS NULL OR c.prioridade = :prioridade) AND " +
           "(:responsavel IS NULL OR :responsavel = '' OR LOWER(c.responsavel) LIKE LOWER(CONCAT('%', :responsavel, '%'))) AND " +
           "(:abertoPor IS NULL OR :abertoPor = '' OR LOWER(c.abertoPor) LIKE LOWER(CONCAT('%', :abertoPor, '%'))) AND " +
           "(:dataInicio IS NULL OR c.dataAbertura >= :dataInicio) AND " +
           "(:dataFim IS NULL OR c.dataAbertura <= :dataFim) " +
           "ORDER BY c.ultimaAtualizacao DESC")
    List<Chamado> findWithFilters(@Param("prioridade") Chamado.Prioridade prioridade,
                                  @Param("responsavel") String responsavel,
                                  @Param("abertoPor") String abertoPor,
                                  @Param("dataInicio") LocalDateTime dataInicio,
                                  @Param("dataFim") LocalDateTime dataFim);
    
    @Query("SELECT COUNT(c) FROM Chamado c WHERE c.prioridade = :prioridade")
    long countByPrioridade(@Param("prioridade") Chamado.Prioridade prioridade);
    
    @Query("SELECT c FROM Chamado c ORDER BY c.dataAbertura DESC")
    List<Chamado> findAllOrderByDataAberturaDesc();
    
    @Query("SELECT c FROM Chamado c ORDER BY c.ultimaAtualizacao DESC")
    List<Chamado> findAllOrderByUltimaAtualizacaoDesc();
    
    List<Chamado> findByStatus(Chamado.Status status);
    
    @Query("SELECT COUNT(c) FROM Chamado c WHERE c.status = :status")
    long countByStatus(@Param("status") Chamado.Status status);
    
    @Query("SELECT COUNT(c) FROM Chamado c WHERE c.status = :status AND c.dataResolucao >= :startOfDay AND c.dataResolucao < :endOfDay")
    long countResolvidosHoje(@Param("status") Chamado.Status status, @Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);
    
    @Query("SELECT COUNT(c) FROM Chamado c WHERE c.status = :status1 OR c.status = :status2")
    long countEmAberto(@Param("status1") Chamado.Status status1, @Param("status2") Chamado.Status status2);
}