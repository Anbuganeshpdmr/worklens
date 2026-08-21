package com.pdmrindia.worklens.module_sprint.mapperDtos;

import com.pdmrindia.worklens.module_project.mapperDtos.SimpleProjectInfoDto;
import com.pdmrindia.worklens.module_sprint.Sprint;
import org.springframework.stereotype.Component;

@Component
public class SimpleSprintInfoDtoMapper {

    public SimpleSprintInfoDto getSimpleSprintInfo(Sprint sprint){
        SimpleSprintInfoDto dto = new SimpleSprintInfoDto();
        dto.setSprintId(sprint.getId());
        dto.setSprintName(sprint.getName());
        return dto;
    }
}
