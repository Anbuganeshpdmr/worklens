package com.pdmrindia.worklens.module_activity_type.mapperDtos;

import com.pdmrindia.worklens.module_activity_type.ActivityType;
import org.springframework.stereotype.Component;

@Component
public class TypeDisplayDtoMapper {

    public TypeDisplayDto getTypeDisplayDto(ActivityType type){
        TypeDisplayDto dto = new TypeDisplayDto();
        dto.setId(type.getId());
        dto.setName(type.getName());
        dto.setColourCode(type.getColourCode());
        dto.setCategoryName(type.getCategory().getName());
        dto.setMandatory(type.isMandatory());
        return dto;
    }

    public SimpleTypeDispDto getSimpleTypeDto(ActivityType type){
        SimpleTypeDispDto dto = new SimpleTypeDispDto();
        dto.setId(type.getId());
        dto.setName(type.getName());
        dto.setColourCode(type.getColourCode());
        return dto;
    }
}
