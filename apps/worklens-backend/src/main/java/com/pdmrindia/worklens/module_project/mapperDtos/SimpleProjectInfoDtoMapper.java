package com.pdmrindia.worklens.module_project.mapperDtos;

import com.pdmrindia.worklens.module_project.Project;
import com.pdmrindia.worklens.module_record_status.mapperDtos.RecordStatusDisplayDto;
import org.springframework.stereotype.Component;

@Component
public class SimpleProjectInfoDtoMapper {

    public SimpleProjectInfoDto getSimpleProjectDisplayDto(Project project){
        SimpleProjectInfoDto dto = new SimpleProjectInfoDto();

        dto.setProjectId(project.getId());
        dto.setProjectName(project.getName());

        return dto;
    }
}
