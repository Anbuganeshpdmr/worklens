package com.pdmrindia.worklens.module_project.mapperDtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjectDto {

    private int projectId;
    private String projectName;
    private int selectedRecordStatusId;
}
