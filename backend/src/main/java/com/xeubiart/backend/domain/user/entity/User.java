package com.xeubiart.backend.domain.user.entity;

import com.xeubiart.backend.domain.user.model.UserRoles;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "tb_users")
@Getter @Setter @Builder @AllArgsConstructor @NoArgsConstructor
public class User {
    @Id
    private UUID id;

    @Enumerated
    private UserRoles role;
}
