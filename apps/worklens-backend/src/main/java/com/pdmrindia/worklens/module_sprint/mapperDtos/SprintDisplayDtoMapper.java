package com.pdmrindia.worklens.module_sprint.mapperDtos;

import com.pdmrindia.worklens.module_project.Project;
import com.pdmrindia.worklens.module_sprint.Sprint;
import com.pdmrindia.worklens.module_sprint_activity.mapperDtos.SprintMetricsDtoMapper;
import com.pdmrindia.worklens.module_status.mapperDtos.StatusDisplayDto;
import com.pdmrindia.worklens.module_status.mapperDtos.StatusDisplayDtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SprintDisplayDtoMapper {

    private final StatusDisplayDtoMapper mapper;
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

        StatusDisplayDto statusDisplayDto = mapper.getStatusDisplayDto(sprint.getStatus());
        dto.setCurrentStatus(statusDisplayDto);

        dto.setSprintMetricsDto(sprintMetricsDtoMapper.getSprintMetrics(sprint));

        return dto;
    }
}
