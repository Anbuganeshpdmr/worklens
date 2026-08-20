package com.pdmrindia.worklens.module_activity.mapperDtos;

import com.pdmrindia.worklens.module_activity_type.ActivityType;
import com.pdmrindia.worklens.module_project.mapperDtos.SimpleProjectInfoDto;
import com.pdmrindia.worklens.module_record_status.mapperDtos.RecordStatusDisplayDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActivityDisplayDto {

    private int activityId;
    private String title;
    private String description;

    private ActivityType activityType;

    private String createdBy;
    private String createdOn;

    private String updatedBy;
    private String updatedOn;

    private RecordStatusDisplayDto currentStatus;

    private SimpleProjectInfoDto projectDetails;

    private int parentActivityId;

    private Integer externalTicketId;

    private Long version;
}
