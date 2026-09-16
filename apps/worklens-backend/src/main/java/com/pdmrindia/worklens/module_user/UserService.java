package com.pdmrindia.worklens.module_user;

import com.pdmrindia.worklens.exception.ResourceException;
import com.pdmrindia.worklens.exception.UserException;
import com.pdmrindia.worklens.module_resource.ResourceService;
import com.pdmrindia.worklens.module_status.Record;
import com.pdmrindia.worklens.module_status.Status;
import com.pdmrindia.worklens.module_status.StatusService;
import com.pdmrindia.worklens.module_user.mapperDtos.*;
import com.pdmrindia.worklens.module_user_role.Role;

import com.pdmrindia.worklens.module_user_role.UserRoleService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final UserRoleService userRoleService;
    private final UserInfoMapper userInfoMapper;
    private final CurrentUserService currentUserService;
    private final StatusService statusService;
    private final ProfilePicConfig profilePicConfig;
    private final ResourceService resourceService;


    public User createUser(NewUserDto newUserDto){
        User newUser = new User();

        if(newUserDto.getName().trim().length()<2) throw new UserException.ShortUserNameException("Username should be minimum 2 characters");
        newUser.setName(newUserDto.getName());
        newUser.setDesignation(newUserDto.getDesignation());
        newUser.setEmpId(newUserDto.getEmpId());
        newUser.setEmailId(newUserDto.getEmailId());

        //  Setting Emp-ID as default password for every user
        newUser.setPassword(passwordEncoder.encode(newUserDto.getEmpId()));

        //  New user will be set Active by default
        newUser.setStatus(statusService.getRecordStatusByName(Record.MEMBER,"active"));

        Role role = userRoleService.getRoleByName(newUserDto.getRole().toUpperCase());
        newUser.setRole(role);

        return userRepo.save(newUser);
    }

    @Transactional
    public User updateUser(long id, UpdateUserDto updatedUserInfoDto){
        User user = findUserById(id);

        //user.setActive(updatedUserInfoDto.isActive());

        Status updatedStatus = statusService.getStatusById(updatedUserInfoDto.getSelectedStatusId());
        statusService.validateRecordStatusOfRecord(Record.MEMBER,updatedStatus);

        if(updatedUserInfoDto.getName().trim().length()<2) throw new UserException.ShortUserNameException("Username should be minimum 2 characters");

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

    @Transactional
    public User changeProfilePic(MultipartFile profilePic, boolean isDpChanged) {
        User user = currentUserService.user();
        if(isDpChanged){
            if(profilePic.isEmpty()){
                user.setDpPath(null);
            }else{
                if (!profilePicConfig.getAllowedTypes().contains(profilePic.getContentType())) {
                    throw new ResourceException.FileTypeMismatchException("File type must be JPG or PNG only");
                }
                if(profilePic.getSize()>profilePicConfig.getMaxSize().toBytes()){
                    throw new ResourceException.FileOverSizeException("Uploaded file size must be less than "+profilePicConfig.getMaxSize());
                }
                user.setDpPath(resourceService.setProfilePicture(profilePic));
            }
        }
        return userRepo.save(user);
    }
}
