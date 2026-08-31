package com.pdmrindia.worklens.module_entry.mapperDtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CloseWorkEntryDto {

    private long entryId;
    private String remarks;
    private int selectedStatusId;
    private int selectedParentStatusId;
}
