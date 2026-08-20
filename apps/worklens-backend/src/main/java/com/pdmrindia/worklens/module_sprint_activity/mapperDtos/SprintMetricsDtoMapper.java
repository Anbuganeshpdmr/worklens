package com.pdmrindia.worklens.module_sprint_activity.mapperDtos;

import com.pdmrindia.worklens.module_record.Record;
import com.pdmrindia.worklens.module_record_status.RecordStatusService;
import com.pdmrindia.worklens.module_sprint.Sprint;
import com.pdmrindia.worklens.module_sprint_activity.SprintActivityRepo;
import com.pdmrindia.worklens.module_status.StatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SprintMetricsDtoMapper {

    private final SprintActivityRepo sprintActivityRepo;
    private final RecordStatusService recordStatusService;
    private final StatusService statusService;

    public SprintMetricsDto getSprintMetrics(Sprint sprint){
        SprintMetricsDto dto = new SprintMetricsDto();

        dto.setUntestedCount(sprintActivityRepo.countBySprintAndRecordStatus(sprint, recordStatusService.getByRecordAndStatus(Record.SPRINT_ACTIVITY, statusService.getStatusByName("Untested"))));
        dto.setBlockedCount(sprintActivityRepo.countBySprintAndRecordStatus(sprint, recordStatusService.getByRecordAndStatus(Record.SPRINT_ACTIVITY, statusService.getStatusByName("Start"))));


        return dto;
    }
}
