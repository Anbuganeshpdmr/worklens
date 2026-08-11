package com.pdmrindia.worklens.module_sprint.mapperDtos;

import com.pdmrindia.worklens.module_record_status.mapperDtos.RecordStatusDisplayDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SprintDisplayDto {

    private int sprintId;
    private String sprintName;
    private int projectId;
    private String projectName;
    private String createdBy;
    private String createdOn;
    private RecordStatusDisplayDto currentStatus;
}
