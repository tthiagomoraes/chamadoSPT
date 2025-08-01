package com.petrobras.chamados.controller;

import com.petrobras.chamados.dto.ApiResponseDTO;
import com.petrobras.chamados.entity.User;
import com.petrobras.chamados.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "https://chamados-frontend.onrender.com"})
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Endpoint para forçar a criação do usuário admin
     * Útil quando o DataInitializer não executou corretamente
     */
    @PostMapping("/create-admin")
    public ResponseEntity<ApiResponseDTO<String>> createAdmin() {
        try {
            // Verificar se já existe
            if (userRepository.existsByUsername("admin")) {
                return ResponseEntity.ok(
                    ApiResponseDTO.success("admin", "Usuário admin já existe")
                );
            }

            // Criar usuário admin
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setNome("Administrador");
            admin.setRole(User.Role.ADMIN);
            admin.setEnabled(true);
            
            userRepository.save(admin);
            
            return ResponseEntity.ok(
                ApiResponseDTO.success("admin", "Usuário admin criado com sucesso! Username: admin, Password: admin")
            );
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(ApiResponseDTO.error("Erro ao criar usuário admin: " + e.getMessage()));
        }
    }

    /**
     * Endpoint para verificar se o usuário admin existe
     */
    @GetMapping("/check-admin")
    public ResponseEntity<ApiResponseDTO<Boolean>> checkAdmin() {
        try {
            boolean adminExists = userRepository.existsByUsername("admin");
            String message = adminExists ? "Usuário admin existe" : "Usuário admin não encontrado";
            
            return ResponseEntity.ok(
                ApiResponseDTO.success(adminExists, message)
            );
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(ApiResponseDTO.error("Erro ao verificar usuário admin: " + e.getMessage()));
        }
    }

    /**
     * Endpoint para resetar a senha do admin para 'admin'
     */
    @PostMapping("/reset-admin-password")
    public ResponseEntity<ApiResponseDTO<String>> resetAdminPassword() {
        try {
            User admin = userRepository.findByUsername("admin")
                .orElseThrow(() -> new RuntimeException("Usuário admin não encontrado"));
            
            admin.setPassword(passwordEncoder.encode("admin"));
            userRepository.save(admin);
            
            return ResponseEntity.ok(
                ApiResponseDTO.success("admin", "Senha do admin resetada para 'admin'")
            );
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(ApiResponseDTO.error("Erro ao resetar senha do admin: " + e.getMessage()));
        }
    }
}