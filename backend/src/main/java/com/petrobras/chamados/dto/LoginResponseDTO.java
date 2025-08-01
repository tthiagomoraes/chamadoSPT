package com.petrobras.chamados.dto;

public class LoginResponseDTO {
    
    private String token;
    private String username;
    private String nome;
    private String role;
    private long expiresIn;

    public LoginResponseDTO() {}

    public LoginResponseDTO(String token, String username, String nome, String role, long expiresIn) {
        this.token = token;
        this.username = username;
        this.nome = nome;
        this.role = role;
        this.expiresIn = expiresIn;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }
}