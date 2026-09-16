package com.pdmrindia.worklens.module_sprint.mapperDtos;

import com.pdmrindia.worklens.module_project.Project;
import com.pdmrindia.worklens.module_sprint.Sprint;
import com.pdmrindia.worklens.module_sprint_activity.SprintActivityRepo;
import com.pdmrindia.worklens.module_sprint_activity.mapperDtos.CountsDto;
import com.pdmrindia.worklens.module_status.mapperDtos.StatusDisplayDto;
import com.pdmrindia.worklens.module_status.mapperDtos.StatusDisplayDtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class SprintDisplayDtoMapper {

    private final StatusDisplayDtoMapper mapper;
    private final SprintActivityRepo sprintActivityRepo;

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

        List<CountsDto> statusCounts = sprintActivityRepo.countByStatus(sprint.getId());
        dto.setStatusCounts(statusCounts);

        List<CountsDto> typeCounts = sprintActivityRepo.countByType(sprint.getId());
        dto.setTypeCounts(typeCounts);
        return dto;
    }
}
