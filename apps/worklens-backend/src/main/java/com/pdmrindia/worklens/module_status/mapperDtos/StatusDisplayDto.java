package com.pdmrindia.worklens.module_status.mapperDtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatusDisplayDto {

    private int statusId;
    private String uniqueName;
    private String displayName;
    private String colourCode;
    private boolean isMandatory;
    private boolean isApplicable;
}
