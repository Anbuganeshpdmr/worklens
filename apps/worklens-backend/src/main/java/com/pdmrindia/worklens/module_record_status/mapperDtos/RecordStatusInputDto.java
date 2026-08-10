package com.pdmrindia.worklens.module_record_status.mapperDtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecordStatusInputDto {

    private int id;
    private boolean isAllowed;
    private boolean isDefault;
}
