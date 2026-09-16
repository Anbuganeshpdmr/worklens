package com.pdmrindia.worklens.module_sprint_activity.mapperDtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SprintActivityManageListDto {

    private Integer sprintId;
    List<Integer> requestedActivityIds;
}
