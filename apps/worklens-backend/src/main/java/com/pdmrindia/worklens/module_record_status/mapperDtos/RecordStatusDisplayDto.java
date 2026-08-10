package com.pdmrindia.worklens.module_record_status.mapperDtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecordStatusDisplayDto {

    private int recordStatusId;
    private String recordName;
    private String statusName;
    private boolean isDefault;
    private boolean isAllowed;
    private String colourCode;
}
