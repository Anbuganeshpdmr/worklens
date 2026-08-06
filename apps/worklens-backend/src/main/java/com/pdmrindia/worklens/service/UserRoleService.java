package com.pdmrindia.worklens.service;

import com.pdmrindia.worklens.model.user.Role;
import com.pdmrindia.worklens.repository.UserRoleRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserRoleService {

    private final UserRoleRepo userRoleRepo;

    // Create, Update, Get,

    public Role getRoleByName(String name){
        return userRoleRepo.findByName(name)
                .orElseThrow(()->new RuntimeException("Role not found"));
    }
}
