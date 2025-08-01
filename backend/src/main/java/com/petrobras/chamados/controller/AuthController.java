package com.petrobras.chamados.controller;

import com.petrobras.chamados.dto.ApiResponseDTO;
import com.petrobras.chamados.dto.LoginRequestDTO;
import com.petrobras.chamados.dto.LoginResponseDTO;
import com.petrobras.chamados.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "https://chamados-frontend.onrender.com"})
public class AuthController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponseDTO<LoginResponseDTO>> login(@Valid @RequestBody LoginRequestDTO request) {
        try {
            LoginResponseDTO response = authenticationService.authenticate(request);
            return ResponseEntity.ok(ApiResponseDTO.success(response, "Login realizado com sucesso"));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401)
                    .body(ApiResponseDTO.error("Credenciais inválidas"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(ApiResponseDTO.error("Erro interno do servidor"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponseDTO<Void>> logout() {
        // Com JWT stateless, o logout é feito no frontend removendo o token
        return ResponseEntity.ok(ApiResponseDTO.success(null, "Logout realizado com sucesso"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponseDTO<String>> getCurrentUser() {
        // Este endpoint pode ser usado para verificar se o token ainda é válido
        return ResponseEntity.ok(ApiResponseDTO.success("Usuário autenticado", "Token válido"));
    }
}