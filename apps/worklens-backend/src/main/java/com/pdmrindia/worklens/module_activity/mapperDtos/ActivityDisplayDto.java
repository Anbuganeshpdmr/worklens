package com.pdmrindia.worklens.module_activity.mapperDtos;

import com.pdmrindia.worklens.module_activity_type.mapperDtos.SimpleTypeDispDto;
import com.pdmrindia.worklens.module_category.mapperDtos.SimpleCategoryDispDto;
import com.pdmrindia.worklens.module_project.mapperDtos.SimpleProjectInfoDto;
import com.pdmrindia.worklens.module_status.mapperDtos.StatusDisplayDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActivityDisplayDto {

    private int activityId;
    private String title;
    private String description;

    private SimpleTypeDispDto activityType;
    private SimpleCategoryDispDto category;

    private String createdBy;
    private String createdOn;

    private String updatedBy;
    private String updatedOn;

    private StatusDisplayDto currentStatus;

    private SimpleProjectInfoDto projectDetails;

    private int parentActivityId;

    private Integer externalTicketId;

    private Long version;
}
