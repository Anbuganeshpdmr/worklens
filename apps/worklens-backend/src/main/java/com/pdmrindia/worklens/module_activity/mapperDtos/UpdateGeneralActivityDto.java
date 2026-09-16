package com.pdmrindia.worklens.module_activity.mapperDtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateGeneralActivityDto {
    private Integer activityId;
    //private Integer typeId;
    private Integer categoryId;
    private String title;
    private String description;
    private Long version;
}
