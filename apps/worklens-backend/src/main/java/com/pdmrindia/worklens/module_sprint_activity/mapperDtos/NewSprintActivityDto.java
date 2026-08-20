package com.pdmrindia.worklens.module_sprint_activity.mapperDtos;

import com.pdmrindia.worklens.module_activity.mapperDtos.NewActivityDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NewSprintActivityDto extends NewActivityDto {

    private Integer sprintId;
}
