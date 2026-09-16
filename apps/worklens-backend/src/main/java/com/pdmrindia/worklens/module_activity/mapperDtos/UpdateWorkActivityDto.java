package com.pdmrindia.worklens.module_activity.mapperDtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateWorkActivityDto {

    private Integer activityId;
    private Integer typeId;
    private Integer categoryId;
    private String title;
    private String description;
    private Integer externalTicketId;
    private Integer parentActivityId;
    private Long version;
}
