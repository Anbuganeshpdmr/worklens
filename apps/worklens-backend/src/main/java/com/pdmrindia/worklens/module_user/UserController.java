package com.pdmrindia.worklens.module_user;

import com.pdmrindia.worklens.module_user.mapperDtos.NewUserDto;
import com.pdmrindia.worklens.module_user.mapperDtos.UserInfoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping
public class UserController {


    //  User - User allowed to modify their DP only
    //  Password - change password, forgot password

    private final UserService userService;
    private final CurrentUserService currentUserService;

    @PostMapping("/login")
    public UserInfoDto getCurrentUserInfoInitial(){
        return userService.getUserInfo(currentUserService.user());
    }

    @GetMapping("/me")
    public UserInfoDto getCurrentUserInfoGen(){
        return userService.getUserInfo(currentUserService.user());
    }

    @PostMapping("/user")
    public void createUser(@RequestBody NewUserDto newUserDto){
        userService.createUser(newUserDto);
    }

    @GetMapping("/users")
    public List<UserInfoDto> getAllUsers(){
        return userService.getAllUsers();
    }

    @PutMapping("/user/{id}")
    public UserInfoDto updateUser(@PathVariable("id") long id, @RequestBody UserInfoDto updatedUserInfoDto){
        return userService.getUserInfo(userService.updateUser(id,updatedUserInfoDto));
    }

}
