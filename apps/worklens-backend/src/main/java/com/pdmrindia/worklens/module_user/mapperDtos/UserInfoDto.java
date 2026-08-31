package com.pdmrindia.worklens.module_user.mapperDtos;

import com.pdmrindia.worklens.module_status.mapperDtos.StatusDisplayDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserInfoDto {

    private long id;
    private String name;
    private String emailId;
    private String empId;
    private String role;
    private String designation;
    private StatusDisplayDto currentStatus;
    private String dpPath;
    private boolean isDpAvailable;
    private String initials;
}
