package com.pdmrindia.worklens;

import com.pdmrindia.worklens.module_activity_type.ActivityTypeService;
import com.pdmrindia.worklens.module_activity_type.mapperDtos.NewTypeDto;
import com.pdmrindia.worklens.module_category.CategoryService;
import com.pdmrindia.worklens.module_category.mapperDtos.NewCategoryDto;
import com.pdmrindia.worklens.module_status.StatusService;
import com.pdmrindia.worklens.module_status.mapperDtos.NewStatusDto;
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
    private final StatusService statusService;
    private final CategoryService categoryService;
    private final ActivityTypeService activityTypeService;


    @Override
    public void run(String... args) throws Exception {
        createMandatoryStatuses();
        createRoles();
        createCategories();
        createActivityTypes();
        createAdminUser("1000","admin@pdmrindia.com","ADMIN","Admin");
    }

    void createCategories() {
        categoryService.createMandatoryCategory(List.of(
                new NewCategoryDto("sprint-testing","#0DCAF0"),
                new NewCategoryDto("team-general","#6F42C1"),
                new NewCategoryDto("office-general","#8A94A6"),
                new NewCategoryDto("break","#0D6EFD")
        ));
    }

    void createActivityTypes() {
        activityTypeService.createMandatoryType(List.of(
                new NewTypeDto("sprint-testing","scenario","#0D6EFD"),
                new NewTypeDto("sprint-testing","feature","#8A94A6"),
                new NewTypeDto("sprint-testing","bug","#6F42C1"),
                new NewTypeDto("sprint-testing","task","#0DCAF0")
        ));
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

    void createMandatoryStatuses(){
        statusService.createMandatoryStatus(List.of(
                new NewStatusDto("PROJECT","active","#0D6EFD"),
                new NewStatusDto("PROJECT","in-active","#8A94A6"),
                new NewStatusDto("SPRINT","active","#6F42C1"),
                new NewStatusDto("SPRINT","in-active","#A181DC"),
                new NewStatusDto("ACTIVITY","ready","#0DCAF0"),
                new NewStatusDto("ACTIVITY","locked","#5C636A"),
                new NewStatusDto("ACTIVITY","retired","#495057"),
                new NewStatusDto("ACTIVITY","available","#198754"),
                new NewStatusDto("SPRINT_ACTIVITY","un-tested","#FFC107"),
                new NewStatusDto("SPRINT_ACTIVITY","in-testing","#FD7E14"),
                new NewStatusDto("SPRINT_ACTIVITY","passed","#20C997"),
                new NewStatusDto("SPRINT_ACTIVITY","failed","#DC3545"),
                new NewStatusDto("SPRINT_ACTIVITY","closed","#212529"),
                new NewStatusDto("SPRINT_ACTIVITY","in-applicable","#E9ECEF"),
                new NewStatusDto("ENTRY","in-process","#0284C7"),
                new NewStatusDto("ENTRY","complete","#15803D"),
                new NewStatusDto("ENTRY","hold","#B45309"),
                new NewStatusDto("MEMBER","active","#10B981"),
                new NewStatusDto("MEMBER","in-active","#9CA3AF")

        ));
    }
}
