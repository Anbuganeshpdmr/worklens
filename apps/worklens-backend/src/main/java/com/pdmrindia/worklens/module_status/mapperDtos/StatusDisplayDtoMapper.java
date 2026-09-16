package com.pdmrindia.worklens.module_status.mapperDtos;

import com.pdmrindia.worklens.module_status.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StatusDisplayDtoMapper {

    public StatusDisplayDto getStatusDisplayDto(Status status){
        StatusDisplayDto dto = new StatusDisplayDto();
        dto.setStatusId(status.getId());
        dto.setDisplayName(status.getDisplayName());
        dto.setColourCode(status.getColourCode());
        dto.setMandatory(status.isMandatory());
        dto.setUniqueName(status.getUniqueName());
        dto.setApplicable(status.isApplicable());
        return dto;
    }
}
