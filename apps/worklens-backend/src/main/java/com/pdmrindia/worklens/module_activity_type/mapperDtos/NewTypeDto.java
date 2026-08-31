package com.pdmrindia.worklens.module_activity_type.mapperDtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NewTypeDto {

    private Object categoryId;
    private String name;
    private String colourCode;
}
