package com.xeubiart.backend.domain.auth.DTO;

import lombok.*;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder
public class LoginRequest {
    private String email;
    private String password;
}
