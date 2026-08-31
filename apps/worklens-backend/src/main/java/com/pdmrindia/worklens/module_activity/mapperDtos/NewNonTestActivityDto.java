package com.pdmrindia.worklens.module_activity.mapperDtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NewNonTestActivityDto {

    private Integer categoryId;
    private Integer typeId;
    private Integer projectId;
    private String title;
    private String description;
}
