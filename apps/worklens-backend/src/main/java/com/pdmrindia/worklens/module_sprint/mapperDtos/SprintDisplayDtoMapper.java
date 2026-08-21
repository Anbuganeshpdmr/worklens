package com.pdmrindia.worklens.module_sprint.mapperDtos;

import com.pdmrindia.worklens.module_project.Project;
import com.pdmrindia.worklens.module_record_status.mapperDtos.RecordStatusDisplayDto;
import com.pdmrindia.worklens.module_record_status.mapperDtos.RecordStatusDisplayDtoMapper;
import com.pdmrindia.worklens.module_sprint.Sprint;
import com.pdmrindia.worklens.module_sprint_activity.mapperDtos.SprintMetricsDtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SprintDisplayDtoMapper {

    private final RecordStatusDisplayDtoMapper mapper;
    private final SprintMetricsDtoMapper sprintMetricsDtoMapper;

    public SprintDisplayDto getSprintDisplayDto(Sprint sprint){
        SprintDisplayDto dto = new SprintDisplayDto();

        dto.setSprintId(sprint.getId());
        dto.setSprintName(sprint.getName());

        Project project = sprint.getProject();
        dto.setProjectId(project.getId());
        dto.setProjectName(project.getName());

        dto.setCreatedBy(sprint.getCreatedBy().getName());
        dto.setCreatedOn(sprint.getCreatedOn().toString());

        RecordStatusDisplayDto recordStatusDisplayDto = mapper.getRecordStatusDisplayDto(sprint.getRecordStatus());
        dto.setCurrentStatus(recordStatusDisplayDto);

        dto.setSprintMetricsDto(sprintMetricsDtoMapper.getSprintMetrics(sprint));

        return dto;
    }
}
