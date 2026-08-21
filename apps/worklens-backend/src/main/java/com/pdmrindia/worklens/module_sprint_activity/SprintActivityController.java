package com.pdmrindia.worklens.module_sprint_activity;

import com.pdmrindia.worklens.module_activity.ActivityRepo;
import com.pdmrindia.worklens.module_activity.ActivityService;
import com.pdmrindia.worklens.module_activity.mapperDtos.ActivityDisplayDto;
import com.pdmrindia.worklens.module_activity.mapperDtos.NewActivityDto;
import com.pdmrindia.worklens.module_activity_type.ActivityType;
import com.pdmrindia.worklens.module_activity_type.ActivityTypeService;
import com.pdmrindia.worklens.module_sprint_activity.mapperDtos.NewSprintActivityDto;
import com.pdmrindia.worklens.module_sprint_activity.mapperDtos.SprintActivityDisplayDto;
import com.pdmrindia.worklens.module_sprint_activity.mapperDtos.SprintActivityDisplayDtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class SprintActivityController {


    private final SprintActivityService sprintActivityService;
    private final ActivityTypeService activityTypeService;
    private final SprintActivityDisplayDtoMapper sprintActivityDisplayDtoMapper;

    @PostMapping("/sprint_activity/feature")
    public SprintActivityDisplayDto createFeatureActivity(@RequestBody NewSprintActivityDto newSprintActivityDto){
        ActivityType type = activityTypeService.getTypeByName("feature");
        SprintActivity sprintActivity = sprintActivityService.createNewSprintActivity(type,newSprintActivityDto);
        return sprintActivityDisplayDtoMapper.getSprintActivityDisplayDto(sprintActivity);
    }

    @PostMapping("/sprint_activity/scenario")
    public SprintActivityDisplayDto createScenarioActivity(@RequestBody NewSprintActivityDto newSprintActivityDto){
        ActivityType type = activityTypeService.getTypeByName("scenario");
        SprintActivity sprintActivity = sprintActivityService.createNewSprintActivity(type,newSprintActivityDto);
        return sprintActivityDisplayDtoMapper.getSprintActivityDisplayDto(sprintActivity);
    }

    @PostMapping("/sprint_activity/bug")
    public SprintActivityDisplayDto createBugActivity(@RequestBody NewSprintActivityDto newSprintActivityDto){
        ActivityType type = activityTypeService.getTypeByName("bug");
        SprintActivity sprintActivity = sprintActivityService.createNewSprintActivity(type,newSprintActivityDto);
        return sprintActivityDisplayDtoMapper.getSprintActivityDisplayDto(sprintActivity);
    }

    @PostMapping("/sprint_activity/task")
    public SprintActivityDisplayDto createTaskActivity(@RequestBody NewSprintActivityDto newSprintActivityDto){
        ActivityType type = activityTypeService.getTypeByName("task");
        SprintActivity sprintActivity = sprintActivityService.createNewSprintActivity(type,newSprintActivityDto);
        return sprintActivityDisplayDtoMapper.getSprintActivityDisplayDto(sprintActivity);
    }

    @GetMapping("/sprint_activity/sprint/{sprintId}")
    public List<SprintActivityDisplayDto> getAllSprintActivities(@PathVariable("sprintId") int sprintId){
        List<SprintActivity> sprintActivityList =  sprintActivityService.getAllSprintActivities(sprintId);
        return sprintActivityList.stream().map(sprintActivityDisplayDtoMapper::getSprintActivityDisplayDto).toList();
    }

    @GetMapping("/sprint_activity/{sprintActivityId}/children")
    public List<SprintActivityDisplayDto> getAllChildActivities(@PathVariable("sprintActivityId") int sprintActivityId){
        List<SprintActivity> sprintActivityList =  sprintActivityService.getChildSprintActivities(sprintActivityId);
        return sprintActivityList.stream().map(sprintActivityDisplayDtoMapper::getSprintActivityDisplayDto).toList();
    }

}
