package com.pdmrindia.worklens.model.user.mapperDtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NewUserDto {

    private String empId;
    private String emailId;
    private String name;
    private String designation;
    private String role;
}
