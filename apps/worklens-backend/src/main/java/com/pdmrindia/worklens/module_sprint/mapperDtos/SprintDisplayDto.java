package com.pdmrindia.worklens.module_sprint.mapperDtos;

import com.pdmrindia.worklens.module_sprint_activity.mapperDtos.CountsDto;
import com.pdmrindia.worklens.module_status.mapperDtos.StatusDisplayDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SprintDisplayDto {

    private int sprintId;
    private String sprintName;
    private int projectId;
    private String projectName;
    private String createdBy;
    private String createdOn;
    private StatusDisplayDto currentStatus;
    private List<CountsDto> typeCounts;
    private List<CountsDto> statusCounts;


}
