package com.pdmrindia.worklens.module_status.mapperDtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class UpdateRecordStatusesDto {
    private String recordName;
    private Set<Integer> applicableStatusIds;
}
