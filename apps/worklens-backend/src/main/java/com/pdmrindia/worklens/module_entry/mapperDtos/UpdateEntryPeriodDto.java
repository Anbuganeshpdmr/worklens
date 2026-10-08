package com.pdmrindia.worklens.module_entry.mapperDtos;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UpdateEntryPeriodDto {

    private Long id;
    private String remarks;
    private LocalDateTime newStartDateTime;
    private LocalDateTime newEndDateTime;
}
