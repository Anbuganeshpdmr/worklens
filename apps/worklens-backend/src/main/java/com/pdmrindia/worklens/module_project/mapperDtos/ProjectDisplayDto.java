package com.pdmrindia.worklens.module_project.mapperDtos;

import com.pdmrindia.worklens.module_record_status.mapperDtos.RecordStatusDisplayDto;
import com.pdmrindia.worklens.module_status.Status;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjectDisplayDto {

    private int projectId;
    private String projectName;
    private String createdBy;
    private String createdOn;
    private RecordStatusDisplayDto currentStatus;
    private long totalSprints;
    private long activeSprints;
    private long totalActivities;

}
