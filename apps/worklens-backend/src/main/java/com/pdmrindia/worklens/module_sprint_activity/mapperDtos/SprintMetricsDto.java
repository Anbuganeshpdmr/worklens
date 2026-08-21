package com.pdmrindia.worklens.module_sprint_activity.mapperDtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SprintMetricsDto {

    private long taskCount;
    private long bugCount;
    private long featureCount;
    private long scenarioCount;
    private long untestedCount;
    private long passedCount;
    private long failedCount;
    private long retestCount;
    private long blockedCount;
    private long inapplicableCount;
}
