package com.pdmrindia.worklens.module_sprint_activity.mapperDtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CloseSprintActivityEntryDto {

    private int sprintActivityId;
    private String remarks;
    private int sprintActivityStatusId;
}
