package com.pdmrindia.worklens.module_user;

import com.pdmrindia.worklens.config.Permissions;
import com.pdmrindia.worklens.module_user.mapperDtos.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping
public class UserController {


    private final UserService userService;
    private final CurrentUserService currentUserService;
    private final OP_CredentialMapper opCredentialMapper;

    @PostMapping("/login")
    public UserInfoDto getCurrentUserInfoInitial(){
        return userService.getUserInfo(currentUserService.user());
    }

    @GetMapping("/me")
    public UserInfoDto getCurrentUserInfoGen(){
        return userService.getUserInfo(currentUserService.user());
    }

    @PreAuthorize(Permissions.FHTLADMIN)
    @PostMapping("/user")
    public UserInfoDto createUser(@RequestBody NewUserDto newUserDto){
        return userService.getUserInfo(userService.createUser(newUserDto));
    }

    @PreAuthorize(Permissions.FHTLADMIN)
    @GetMapping("/users")
    public List<UserInfoDto> getAllUsers(){
        return userService.getAllUsers();
    }

    @PreAuthorize(Permissions.FHTLADMIN)
    @PutMapping("/user/{id}")
    public UserInfoDto updateUser(@PathVariable("id") long id, @RequestBody UpdateUserDto updatedUserInfoDto){
        return userService.getUserInfo(userService.updateUser(id,updatedUserInfoDto));
    }

    @PostMapping("/me/password")
    public void changePassword(@RequestBody ChangePasswordDto changePasswordDto){
        userService.changePassword(changePasswordDto);
    }

    @PreAuthorize(Permissions.FHTLADMIN)
    @PostMapping("/user/{id}/reset_password")
    public void resetPassword(@PathVariable("id") long id, @RequestBody Map<String,String> resetPasswordDto){
        userService.resetPassword(id,resetPasswordDto);
    }

    @PostMapping("/me/dp")
    public UserInfoDto updateProfilePic(@RequestParam(value = "profilePic",required = false) MultipartFile profilePic,
                                        @RequestParam("isDpChanged") boolean isDpChanged){
        User user = userService.changeProfilePic(profilePic,isDpChanged);
        return userService.getUserInfo(user);
    }

    @PostMapping("/me/key")
    public OpenprojectCredentials updateOpCredentials(@RequestBody OpenprojectCredentials openprojectCredentials){
        User user = userService.updateOpenprojectCredentials(openprojectCredentials);
        return opCredentialMapper.getOpCredentials(user);
    }

    @GetMapping("/me/key")
    public OpenprojectCredentials getOpCredentials(){
        User user = currentUserService.user();
        return opCredentialMapper.getOpCredentials(user);
    }

}
