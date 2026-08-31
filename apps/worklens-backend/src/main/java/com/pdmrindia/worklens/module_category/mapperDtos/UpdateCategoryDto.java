package com.pdmrindia.worklens.module_category.mapperDtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCategoryDto {

    private Integer categoryId;
    private String name;
    private String colourCode;
}
