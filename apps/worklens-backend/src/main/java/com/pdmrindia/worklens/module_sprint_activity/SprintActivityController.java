package com.pdmrindia.worklens.module_sprint_activity;

import com.pdmrindia.worklens.module_activity_type.ActivityType;
import com.pdmrindia.worklens.module_activity_type.ActivityTypeService;
import com.pdmrindia.worklens.module_sprint.Sprint;
import com.pdmrindia.worklens.module_sprint.SprintService;
import com.pdmrindia.worklens.module_sprint_activity.mapperDtos.NewSprintNonTestActivityDto;
import com.pdmrindia.worklens.module_sprint_activity.mapperDtos.SprintActivityDisplayDto;
import com.pdmrindia.worklens.module_sprint_activity.mapperDtos.SprintActivityDisplayDtoMapper;
import com.pdmrindia.worklens.module_sprint_activity.mapperDtos.SprintActivityManageListDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class SprintActivityController {


    private final SprintActivityService sprintActivityService;
    private final SprintActivityRepo sprintActivityRepo;
    private final SprintService sprintService;
    private final SprintActivityDisplayDtoMapper sprintActivityDisplayDtoMapper;

    @PutMapping("/sprint_activity/update")
    public void manageSprintActivities(@RequestBody SprintActivityManageListDto sprintActivityManageListDto){
        sprintActivityService.syncSprintActivities(sprintActivityManageListDto);
    }

    @GetMapping("sprint_activity/sprint/{sprintId}/list")
    public List<Integer> getSprintActivitiesIdsList(@PathVariable("sprintId") int sprintId){
        Sprint sprint = sprintService.getSprintById(sprintId);
        List<SprintActivity> allowedList = sprintActivityRepo.findBySprintAndIsAllowed(sprint,true);
        return allowedList.stream().map(sa->sa.getActivity().getId()).toList();
    }

    @GetMapping("sprint_activity/sprint/{sprintId}")
    public List<SprintActivityDisplayDto> getSprintActivitiesList(@PathVariable("sprintId") int sprintId){
        Sprint sprint = sprintService.getSprintById(sprintId);
        List<SprintActivity> allowedList = sprintActivityRepo.findBySprintAndIsAllowed(sprint,true);
        return allowedList.stream().map(sprintActivityDisplayDtoMapper::getSprintActivityDisplayDto).toList();
    }

}
