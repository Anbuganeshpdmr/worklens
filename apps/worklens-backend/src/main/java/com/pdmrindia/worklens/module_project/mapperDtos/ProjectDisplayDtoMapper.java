package com.pdmrindia.worklens.module_project.mapperDtos;

import com.pdmrindia.worklens.module_project.Project;
import com.pdmrindia.worklens.module_record_status.mapperDtos.RecordStatusDisplayDto;
import com.pdmrindia.worklens.module_record_status.mapperDtos.RecordStatusDisplayDtoMapper;
import com.pdmrindia.worklens.module_sprint.Sprint;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.util.List;

@Getter
@Setter
@Component
@RequiredArgsConstructor
public class ProjectDisplayDtoMapper {

    private final RecordStatusDisplayDtoMapper mapper;

    public ProjectDisplayDto getProjectDisplayDto(Project project){
        ProjectDisplayDto dto = new ProjectDisplayDto();

        dto.setProjectId(project.getId());
        dto.setProjectName(project.getName());
        dto.setCreatedBy(project.getCreatedBy().getName());
        dto.setCreatedOn(project.getCreatedOn().toString());

        RecordStatusDisplayDto recordStatusDisplayDto = mapper.getRecordStatusDisplayDto(project.getRecordStatus());
        dto.setCurrentStatus(recordStatusDisplayDto);

        List<Sprint> sprintList =  project.getSprints();
        dto.setTotalSprints(sprintList.size());

        dto.setActiveSprints(sprintList.stream().filter(s->s.getRecordStatus().getStatus().getName().equals("Active")).count());

        return dto;
    }
}
