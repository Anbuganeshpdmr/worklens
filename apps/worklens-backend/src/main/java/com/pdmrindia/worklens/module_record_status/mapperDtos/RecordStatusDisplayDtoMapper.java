package com.pdmrindia.worklens.module_record_status.mapperDtos;

import com.pdmrindia.worklens.module_record_status.RecordStatus;
import org.springframework.stereotype.Component;

@Component
public class RecordStatusDisplayDtoMapper {

    public RecordStatusDisplayDto getRecordStatusDisplayDto(RecordStatus recordStatus){
        RecordStatusDisplayDto dto = new RecordStatusDisplayDto();

        dto.setRecordStatusId(recordStatus.getId());

        dto.setRecordName(recordStatus.getRecord().name());
        dto.setStatusName(recordStatus.getStatus().getName());
        dto.setColourCode(recordStatus.getStatus().getColourCode());

        dto.setDefault(recordStatus.isDefault());
        dto.setAllowed(recordStatus.isAllowed());
        return dto;
    }
}
