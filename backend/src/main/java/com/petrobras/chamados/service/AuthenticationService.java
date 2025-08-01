package com.petrobras.chamados.service;

import com.petrobras.chamados.dto.LoginRequestDTO;
import com.petrobras.chamados.dto.LoginResponseDTO;
import com.petrobras.chamados.entity.User;
import com.petrobras.chamados.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public LoginResponseDTO authenticate(LoginRequestDTO request) throws AuthenticationException {
        // Autenticar o usuário
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        // Buscar o usuário no banco
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Atualizar último login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // Gerar JWT token
        String jwtToken = jwtService.generateToken(user);

        return new LoginResponseDTO(
                jwtToken,
                user.getUsername(),
                user.getNome(),
                user.getRole().name(),
                jwtService.getExpirationTime()
        );
    }
}