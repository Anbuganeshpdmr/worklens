package com.pdmrindia.worklens.module_sprint_activity.mapperDtos;

import com.pdmrindia.worklens.module_activity.mapperDtos.NewNonTestActivityDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NewSprintNonTestActivityDto extends NewNonTestActivityDto {

    private Integer sprintId;
}
