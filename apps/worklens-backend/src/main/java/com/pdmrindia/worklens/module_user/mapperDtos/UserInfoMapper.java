package com.pdmrindia.worklens.module_user.mapperDtos;

import com.pdmrindia.worklens.module_record_status.mapperDtos.RecordStatusDisplayDto;
import com.pdmrindia.worklens.module_record_status.mapperDtos.RecordStatusDisplayDtoMapper;
import com.pdmrindia.worklens.module_user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserInfoMapper {

    //  Basic User Info
    //  shall later add Profile-pic
    private final RecordStatusDisplayDtoMapper mapper;

    public UserInfoDto createSimpleUserInfo(User user){
        UserInfoDto userInfoDto = new UserInfoDto();
        userInfoDto.setId(user.getId());
        userInfoDto.setName(user.getName());
        userInfoDto.setEmailId(user.getEmailId());
        userInfoDto.setEmpId(user.getEmpId());
        userInfoDto.setRole(user.getRole().getName());
        userInfoDto.setDesignation(user.getDesignation());

        //userInfoDto.setActive(user.isActive());
        RecordStatusDisplayDto recordStatusDisplayDto = mapper.getRecordStatusDisplayDto(user.getRecordStatus());
        userInfoDto.setCurrentStatus(recordStatusDisplayDto);

        return userInfoDto;
    }
}
