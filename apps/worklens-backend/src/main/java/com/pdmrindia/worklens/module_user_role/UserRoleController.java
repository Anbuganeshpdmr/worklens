package com.pdmrindia.worklens.module_user_role;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class UserRoleController {

    private final UserRoleRepo userRoleRepo;
    private final UserRoleService userRoleService;

    @GetMapping("/roles")
    public List<Role> getAllRoles(){
        return userRoleRepo.findAll();
    }

    @PutMapping("/roles")
    public Role updateRole(@RequestBody Role updatedRole){
        return userRoleService.updateRole(updatedRole.getId(), updatedRole.getName());
    }

    @PostMapping("/roles")
    public Role createNewRole(@RequestBody Role newRole){
        return userRoleService.createNewRole(newRole.getName());
    }
}
