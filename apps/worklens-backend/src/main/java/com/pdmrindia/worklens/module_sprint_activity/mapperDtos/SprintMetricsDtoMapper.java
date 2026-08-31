package com.pdmrindia.worklens.module_sprint_activity.mapperDtos;

import com.pdmrindia.worklens.module_status.Record;
import com.pdmrindia.worklens.module_sprint.Sprint;
import com.pdmrindia.worklens.module_sprint_activity.SprintActivityRepo;
import com.pdmrindia.worklens.module_status.StatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SprintMetricsDtoMapper {

    private final SprintActivityRepo sprintActivityRepo;
    private final StatusService statusService;

    public SprintMetricsDto getSprintMetrics(Sprint sprint){
        SprintMetricsDto dto = new SprintMetricsDto();

        dto.setUntestedCount(sprintActivityRepo.countBySprintAndStatus(sprint, statusService.getRecordStatusByName(Record.SPRINT_ACTIVITY, "un-tested")));
        dto.setBlockedCount(sprintActivityRepo.countBySprintAndStatus(sprint, statusService.getRecordStatusByName(Record.SPRINT_ACTIVITY, "in-testing")));

        return dto;
    }
}
