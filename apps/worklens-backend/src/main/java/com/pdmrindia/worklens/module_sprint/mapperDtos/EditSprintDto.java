package com.pdmrindia.worklens.module_sprint.mapperDtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EditSprintDto {

    private int sprintId;
    private String sprintName;
    private int selectedRecordStatusId;
}
