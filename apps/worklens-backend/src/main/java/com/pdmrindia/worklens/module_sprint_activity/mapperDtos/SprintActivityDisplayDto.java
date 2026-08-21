package com.pdmrindia.worklens.module_sprint_activity.mapperDtos;

import com.pdmrindia.worklens.module_activity.mapperDtos.ActivityDisplayDto;
import com.pdmrindia.worklens.module_record_status.mapperDtos.RecordStatusDisplayDto;
import com.pdmrindia.worklens.module_sprint.mapperDtos.SimpleSprintInfoDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SprintActivityDisplayDto {

    private int sprintActivityId;

    private Long version;

    private SimpleSprintInfoDto simpleSprintInfo;

    private ActivityDisplayDto simpleActivityInfo;

    private RecordStatusDisplayDto currentStatus;

}
