package com.pdmrindia.worklens;

import com.pdmrindia.worklens.module_user.mapperDtos.NewUserDto;
import com.pdmrindia.worklens.module_user.User;
import com.pdmrindia.worklens.module_user.UserRepo;
import com.pdmrindia.worklens.module_user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class StartupTask implements CommandLineRunner {

    private final UserService userService;
    private final UserRepo userRepo;


    @Override
    public void run(String... args) throws Exception {
        createAdminUser("1000","admin@pdmrindia.com","ADMIN","Admin");
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
