package com.pdmrindia.worklens.module_entry.filter;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class EntryFilterRequest {

    private LocalDate fromDate;

    private LocalDate toDate;

    private List<Long> userIds;

    private List<Long> activityIds;

    private List<Long> projectIds;

    private List<Long> sprintIds;

    private List<Long> activityTypeIds;

    private List<Long> categoryIds;

    private List<Long> statusIds;
}
