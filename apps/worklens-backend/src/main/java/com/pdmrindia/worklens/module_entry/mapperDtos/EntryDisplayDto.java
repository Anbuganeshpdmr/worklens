package com.pdmrindia.worklens.module_entry.mapperDtos;

import com.pdmrindia.worklens.module_activity_type.ActivityType;

import com.pdmrindia.worklens.module_activity_type.mapperDtos.SimpleTypeDispDto;
import com.pdmrindia.worklens.module_category.mapperDtos.SimpleCategoryDispDto;
import com.pdmrindia.worklens.module_status.mapperDtos.StatusDisplayDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EntryDisplayDto {

    private Long id;
    private Integer sprintActivityId;
    private Integer activityId;
    private String sprintName;
    private String projectName;
    private StatusDisplayDto currentStatus;
    private String name;
    private String description;
    private SimpleTypeDispDto activityType;
    private SimpleCategoryDispDto category;
    private Integer externalTicketId;
    private String user;
    private String activityDate;
    private String startTime;
    private String endTime;
    private String duration;
    private String remarks;
}
