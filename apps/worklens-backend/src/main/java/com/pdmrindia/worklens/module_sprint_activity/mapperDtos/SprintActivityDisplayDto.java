package com.pdmrindia.worklens.module_sprint_activity.mapperDtos;

import com.pdmrindia.worklens.module_activity.mapperDtos.ActivityDisplayDto;
import com.pdmrindia.worklens.module_sprint.mapperDtos.SimpleSprintInfoDto;
import com.pdmrindia.worklens.module_status.mapperDtos.StatusDisplayDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SprintActivityDisplayDto {

    private int sprintActivityId;

    private Long version;

    private Long entryId;

    private String currentUser;

    private SimpleSprintInfoDto simpleSprintInfo;

    private ActivityDisplayDto simpleActivityInfo;

    private StatusDisplayDto currentStatus;

}
