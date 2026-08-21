package com.pdmrindia.worklens.module_user;

import com.pdmrindia.worklens.module_user.mapperDtos.ChangePasswordDto;
import com.pdmrindia.worklens.module_user.mapperDtos.NewUserDto;
import com.pdmrindia.worklens.module_user.mapperDtos.UpdateUserDto;
import com.pdmrindia.worklens.module_user.mapperDtos.UserInfoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
    public UserInfoDto createUser(@RequestBody NewUserDto newUserDto){
        return userService.getUserInfo(userService.createUser(newUserDto));
    }

    @GetMapping("/users")
    public List<UserInfoDto> getAllUsers(){
        return userService.getAllUsers();
    }

    @PutMapping("/user/{id}")
    public UserInfoDto updateUser(@PathVariable("id") long id, @RequestBody UpdateUserDto updatedUserInfoDto){
        return userService.getUserInfo(userService.updateUser(id,updatedUserInfoDto));
    }

    @PostMapping("/me/password")
    public void changePassword(@RequestBody ChangePasswordDto changePasswordDto){
        userService.changePassword(changePasswordDto);
    }

    @PostMapping("/user/{id}/reset_password")
    public void resetPassword(@PathVariable("id") long id, @RequestBody Map<String,String> resetPasswordDto){
        userService.resetPassword(id,resetPasswordDto);
    }
}
