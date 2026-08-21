package com.pdmrindia.worklens;

import com.pdmrindia.worklens.module_user.mapperDtos.NewUserDto;
import com.pdmrindia.worklens.module_user.User;
import com.pdmrindia.worklens.module_user.UserRepo;
import com.pdmrindia.worklens.module_user.UserService;
import com.pdmrindia.worklens.module_user_role.Role;
import com.pdmrindia.worklens.module_user_role.UserRoleRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class StartupTask implements CommandLineRunner {

    private final UserService userService;
    private final UserRepo userRepo;
    private final UserRoleRepo userRoleRepo;


    @Override
    public void run(String... args) throws Exception {
        //  Check & Create 'Active' status if not exists
        //  Check all Records have default status. If not, Make 'Active' as their default status

        //  Create mandatory Activity-Types like 'Test,General,etc'

        createRoles();
        createAdminUser("1000","admin@pdmrindia.com","ADMIN","Admin");
    }

    void createRoles(){
        List<String> roleNames = List.of("ADMIN", "FH", "TL", "MEMBER");
        List<Role> existingRoles = userRoleRepo.findByNameIn(roleNames);

        Set<String> existingRoleNames = existingRoles.stream()
                .map(Role::getName)
                .peek(role-> System.out.println(role+"-role is available"))
                .collect(Collectors.toSet());

        List<Role> newRoleList = roleNames.stream()
                .filter(roleName -> !existingRoleNames.contains(roleName))
                .map(roleName -> {
                    System.out.println("Adding Role: "+roleName);
                    Role newRole = new Role();
                    newRole.setName(roleName);
                    return newRole;
                })
                .collect(Collectors.toList());

        if (!newRoleList.isEmpty()) {
            userRoleRepo.saveAll(newRoleList);
        }
    }

    void createAdminUser(String empId, String emailId, String role, String name) {

        Optional<User> adminUser = userRepo.findByEmpId(empId);
        if(adminUser.isEmpty()){

            System.out.println("Seeding Admin user:-");

            NewUserDto newUserDto = new NewUserDto();
            newUserDto.setEmpId(empId);
            newUserDto.setEmailId(emailId);
            newUserDto.setRole(role);
            newUserDto.setName(name);

            userService.createUser(newUserDto);
            System.out.println("Admin User is created");
        }else{
            System.out.println("Admin user is available");
        }
        System.out.println("""
                Please use the following credential for initial employee:
                identifier:1000
                password:1000""");
    }
}
