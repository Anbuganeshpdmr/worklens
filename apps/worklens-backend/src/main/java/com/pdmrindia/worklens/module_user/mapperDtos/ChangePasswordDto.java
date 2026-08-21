package com.pdmrindia.worklens.module_user.mapperDtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordDto {

    private String oldPassword;
    private String newPassword;
}
