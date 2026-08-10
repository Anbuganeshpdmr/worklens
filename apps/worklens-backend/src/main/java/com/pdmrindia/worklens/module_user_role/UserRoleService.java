package com.pdmrindia.worklens.module_user_role;

import lombok.RequiredArgsConstructor;
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
