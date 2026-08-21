package com.pdmrindia.worklens.module_activity.mapperDtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NewActivityDto {

    private Integer projectId;
    private String title;
    private String description;
    private Integer linkedTicketId;
    private Integer parentActivityId;
}
