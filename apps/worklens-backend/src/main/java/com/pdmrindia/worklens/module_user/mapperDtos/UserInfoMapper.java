package com.pdmrindia.worklens.module_user.mapperDtos;

import com.pdmrindia.worklens.module_user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserInfoMapper {

    //  Basic User Info
    //  shall later add Profile-pic
    public UserInfoDto createSimpleUserInfo(User user){
        UserInfoDto userInfoDto = new UserInfoDto();
        userInfoDto.setUuid(user.getUuid());
        userInfoDto.setName(user.getName());
        userInfoDto.setEmailId(user.getEmailId());
        userInfoDto.setEmpId(user.getEmpId());
        userInfoDto.setRole(user.getRole().getName());
        userInfoDto.setActive(user.isActive());
        userInfoDto.setDesignation(user.getDesignation());
        return userInfoDto;
    }
}
