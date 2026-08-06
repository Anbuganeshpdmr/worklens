package com.pdmrindia.worklens.service;

import com.pdmrindia.worklens.model.user.mapperDtos.NewUserDto;
import com.pdmrindia.worklens.model.user.Role;
import com.pdmrindia.worklens.model.user.User;
import com.pdmrindia.worklens.model.user.mapperDtos.UserInfoDto;
import com.pdmrindia.worklens.model.user.mapperDtos.UserInfoMapper;
import com.pdmrindia.worklens.repository.UserRepo;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final UserRoleService userRoleService;
    private final UserInfoMapper userInfoMapper;


    public void createUser(NewUserDto newUserDto){
        User newUser = new User();

        newUser.setName(newUserDto.getName());
        newUser.setDesignation(newUserDto.getDesignation());
        newUser.setEmpId(newUserDto.getEmpId());
        newUser.setEmailId(newUserDto.getEmailId());

        // Setting Emp-ID as default password for every user
        newUser.setPassword(passwordEncoder.encode(newUserDto.getEmpId()));

        // New user will be set Active by default
        newUser.setActive(true);

        Role role = userRoleService.getRoleByName(newUserDto.getRole().toUpperCase());
        newUser.setRole(role);

        userRepo.save(newUser);
    }

    @Transactional
    public User updateUser(long id, UserInfoDto updatedUserInfoDto){
        User user = findUserById(id);

        user.setActive(updatedUserInfoDto.isActive());
        user.setName(updatedUserInfoDto.getName());
        user.setDesignation(updatedUserInfoDto.getDesignation());
        user.setEmpId(updatedUserInfoDto.getEmpId());
        user.setEmailId(updatedUserInfoDto.getEmailId());

        Role updatedRole = userRoleService.getRoleByName(updatedUserInfoDto.getRole().toUpperCase());
        user.setRole(updatedRole);

        return userRepo.save(user);
    }

    public User findUserByEmpId(String empId){
        return userRepo.findByEmpId(empId)
                .orElseThrow(()->new RuntimeException("No user Found"));
    }

    public User findUserById(long id){
        return userRepo.findById(id)
                .orElseThrow(()->new RuntimeException("No user Found"));
    }

    public UserInfoDto getUserInfo(User user){
        return userInfoMapper.createSimpleUserInfo(user);
    }

    public List<UserInfoDto> getAllUsers(){
        return userRepo.findAll().stream().map(userInfoMapper::createSimpleUserInfo).toList();
    }


}
