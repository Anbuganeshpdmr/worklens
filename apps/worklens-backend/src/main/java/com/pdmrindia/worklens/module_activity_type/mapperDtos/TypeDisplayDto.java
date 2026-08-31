package com.pdmrindia.worklens.module_activity_type.mapperDtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TypeDisplayDto {

    private Integer id;
    private String name;
    private String colourCode;
    private String categoryName;
    private boolean isMandatory;
}
