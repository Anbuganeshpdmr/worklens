package com.pdmrindia.worklens.module_user_role;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "roles", uniqueConstraints = {
        @UniqueConstraint(name = "uk_role_name",columnNames = "name")
})
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name", unique = true, nullable = false)
    private String name;
}
