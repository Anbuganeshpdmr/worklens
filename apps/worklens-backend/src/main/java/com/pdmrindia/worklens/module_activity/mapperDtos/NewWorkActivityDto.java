package com.pdmrindia.worklens.module_activity.mapperDtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NewWorkActivityDto {

    private Integer typeId;
    private Integer categoryId;
    private Integer projectId;
    private String title;
    private String description;
    private Integer externalTicketId;
    private Integer parentActivityId;
    //private Integer statusId;
}
