package com.pdmrindia.worklens.module_user;

import com.pdmrindia.worklens.module_record_status.RecordStatus;
import com.pdmrindia.worklens.module_user_role.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_email", columnNames = "email_id"),
        @UniqueConstraint(name = "uk_user_emp", columnNames = "emp_id")
})
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String empId;

    @Column(unique = true, nullable = false)
    private String emailId;

   /* @Column(nullable = false)
    private boolean isActive;*/

    @ManyToOne
    @JoinColumn(name = "record_status_id",nullable = false)
    private RecordStatus recordStatus;

    private String designation;

    @ManyToOne(optional = false)
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_"+this.role.getName()));
    }

    @Override
    public String getUsername() {
        return empId;
    }

    @Override
    public boolean isEnabled() {
        return this.getRecordStatus().getStatus().getName().equalsIgnoreCase("Active");
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
}
