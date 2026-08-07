package com.pdmrindia.worklens.module_user.mapperDtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserInfoDto {

    private String uuid;
    private String name;
    private String emailId;
    private String empId;
    private String role;
    private String designation;
    private boolean isActive;
}
