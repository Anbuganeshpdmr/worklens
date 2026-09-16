package com.pdmrindia.worklens.module_category.mapperDtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryDisplayDto {

    private Integer id;
    private String name;
    private String colourCode;
    private boolean isMandatory;
}
