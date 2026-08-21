package com.pdmrindia.worklens.module_user_role;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserRoleService {

    private final UserRoleRepo userRoleRepo;

    public Role createNewRole(String name){
        Role role = new Role();
        role.setName(name.toUpperCase());
        return userRoleRepo.save(role);
    }

    public Role updateRole(int id, String name){
        Role existingRole = getRoleById(id);
        existingRole.setName(name.toUpperCase());
        return userRoleRepo.save(existingRole);
    }

    public Role getRoleByName(String name){
        return userRoleRepo.findByName(name)
                .orElseThrow(()->new RuntimeException("Role not found"));
    }

    public Role getRoleById(int id){
        return userRoleRepo.findById(id)
                .orElseThrow(()->new RuntimeException("Role not found"));
    }
}
