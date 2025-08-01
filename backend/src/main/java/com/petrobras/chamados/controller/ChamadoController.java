package com.petrobras.chamados.controller;

import com.petrobras.chamados.dto.ApiResponseDTO;
import com.petrobras.chamados.dto.ChamadoRequestDTO;
import com.petrobras.chamados.dto.ChamadoResponseDTO;
import com.petrobras.chamados.dto.DashboardStatsDTO;
import com.petrobras.chamados.service.ChamadoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chamados")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "https://chamados-frontend.onrender.com"})
public class ChamadoController {

    @Autowired
    private ChamadoService chamadoService;

    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<ChamadoResponseDTO>>> getAllChamados() {
        List<ChamadoResponseDTO> chamados = chamadoService.findAll();
        return ResponseEntity.ok(ApiResponseDTO.success(chamados));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<ChamadoResponseDTO>> getChamadoById(@PathVariable Long id) {
        ChamadoResponseDTO chamado = chamadoService.findById(id);
        return ResponseEntity.ok(ApiResponseDTO.success(chamado));
    }

    @PostMapping
    public ResponseEntity<ApiResponseDTO<ChamadoResponseDTO>> createChamado(@Valid @RequestBody ChamadoRequestDTO requestDTO) {
        ChamadoResponseDTO chamado = chamadoService.create(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseDTO.success(chamado, "Chamado criado com sucesso"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<ChamadoResponseDTO>> updateChamado(
            @PathVariable Long id, 
            @Valid @RequestBody ChamadoRequestDTO requestDTO) {
        ChamadoResponseDTO chamado = chamadoService.update(id, requestDTO);
        return ResponseEntity.ok(ApiResponseDTO.success(chamado, "Chamado atualizado com sucesso"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<Void>> deleteChamado(@PathVariable Long id) {
        chamadoService.delete(id);
        return ResponseEntity.ok(ApiResponseDTO.success(null, "Chamado excluído com sucesso"));
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponseDTO<DashboardStatsDTO>> getDashboardStats() {
        DashboardStatsDTO stats = chamadoService.getDashboardStats();
        return ResponseEntity.ok(ApiResponseDTO.success(stats));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponseDTO<List<ChamadoResponseDTO>>> getChamadosWithFilters(
            @RequestParam(required = false) String prioridade,
            @RequestParam(required = false) String responsavel,
            @RequestParam(required = false) String abertoPor,
            @RequestParam(required = false) String dataInicio,
            @RequestParam(required = false) String dataFim) {
        
        List<ChamadoResponseDTO> chamados = chamadoService.findWithFilters(
                prioridade, responsavel, abertoPor, dataInicio, dataFim);
        return ResponseEntity.ok(ApiResponseDTO.success(chamados));
    }
}