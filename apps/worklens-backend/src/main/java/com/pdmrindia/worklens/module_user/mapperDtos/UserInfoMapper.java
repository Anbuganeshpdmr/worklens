package com.pdmrindia.worklens.module_user.mapperDtos;

import com.pdmrindia.worklens.module_status.mapperDtos.StatusDisplayDtoMapper;
import com.pdmrindia.worklens.module_user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserInfoMapper {

    private final StatusDisplayDtoMapper mapper;

    public UserInfoDto createSimpleUserInfo(User user){
        UserInfoDto userInfoDto = new UserInfoDto();
        userInfoDto.setId(user.getId());
        userInfoDto.setName(user.getName());
        userInfoDto.setEmailId(user.getEmailId());
        userInfoDto.setEmpId(user.getEmpId());
        userInfoDto.setRole(user.getRole().getName());
        userInfoDto.setDesignation(user.getDesignation());
        userInfoDto.setCurrentStatus(mapper.getStatusDisplayDto(user.getStatus()));
        userInfoDto.setInitials(user.getInitials());
        userInfoDto.setDpPath(user.getDpPath());
        userInfoDto.setDpAvailable(user.isDpAvailable());

        return userInfoDto;
    }
}
