package com.pdmrindia.worklens.module_user;

import com.pdmrindia.worklens.exception.UserException;
import com.pdmrindia.worklens.module_record.Record;
import com.pdmrindia.worklens.module_record_status.RecordStatus;
import com.pdmrindia.worklens.module_record_status.RecordStatusService;
import com.pdmrindia.worklens.module_user.mapperDtos.*;
import com.pdmrindia.worklens.module_user_role.Role;

import com.pdmrindia.worklens.module_user_role.UserRoleService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final UserRoleService userRoleService;
    private final UserInfoMapper userInfoMapper;
    private final RecordStatusService recordStatusService;
    private final CurrentUserService currentUserService;


    public User createUser(NewUserDto newUserDto){
        User newUser = new User();

        newUser.setName(newUserDto.getName());
        newUser.setDesignation(newUserDto.getDesignation());
        newUser.setEmpId(newUserDto.getEmpId());
        newUser.setEmailId(newUserDto.getEmailId());

        //  Setting Emp-ID as default password for every user
        newUser.setPassword(passwordEncoder.encode(newUserDto.getEmpId()));

        //  New user will be set Active by default
        //  newUser.setActive(true);
        newUser.setRecordStatus(recordStatusService.getDefaultRecordStatus(Record.MEMBER));

        Role role = userRoleService.getRoleByName(newUserDto.getRole().toUpperCase());
        newUser.setRole(role);

        return userRepo.save(newUser);
    }

    @Transactional
    public User updateUser(long id, UpdateUserDto updatedUserInfoDto){
        User user = findUserById(id);

        //user.setActive(updatedUserInfoDto.isActive());

        RecordStatus updatedRecordStatus = recordStatusService.getRecordStatusById(updatedUserInfoDto.getSelectedRecordStatusId());
        recordStatusService.validateRecordStatusOfRecord(Record.MEMBER,updatedRecordStatus);

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

    public void changePassword(ChangePasswordDto changePasswordDto){
        User currentUser = currentUserService.user();

        if(passwordEncoder.matches(changePasswordDto.getOldPassword(),currentUser.getPassword())){
            currentUser.setPassword(passwordEncoder.encode(changePasswordDto.getNewPassword()));
            userRepo.save(currentUser);
        }else{
            throw new UserException.PasswordNotCorrectException("Old password not correct");
        }
    }

    public void resetPassword(long id, Map<String, String> resetPasswordDto) {
        User user = findUserById(id);
        System.out.println("New pwd: "+resetPasswordDto.get("newPassword"));
        user.setPassword(passwordEncoder.encode(resetPasswordDto.get("newPassword")));
        userRepo.save(user);
    }
}
