package com.pdmrindia.worklens.module_activity;

import com.pdmrindia.worklens.module_activity.mapperDtos.ActivityDisplayDto;
import com.pdmrindia.worklens.module_activity.mapperDtos.ActivityDisplayDtoMapper;
import com.pdmrindia.worklens.module_activity.mapperDtos.NewActivityDto;
import com.pdmrindia.worklens.module_activity_type.ActivityType;
import com.pdmrindia.worklens.module_activity_type.ActivityTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;
    private final ActivityTypeService activityTypeService;
    private final ActivityDisplayDtoMapper activityDisplayDtoMapper;


    @PostMapping("/activity/feature")
    public ActivityDisplayDto createFeatureActivity(@RequestBody NewActivityDto newActivityDto){
        ActivityType type = activityTypeService.getTypeByName("feature");
        Activity activity = activityService.createNewActivity(type,newActivityDto);
        return activityDisplayDtoMapper.getActivityDisplayDto(activity);
    }

    @PostMapping("/activity/scenario")
    public ActivityDisplayDto createScenarioActivity(@RequestBody NewActivityDto newActivityDto){
        ActivityType type = activityTypeService.getTypeByName("scenario");
        Activity activity = activityService.createNewActivity(type,newActivityDto);
        return activityDisplayDtoMapper.getActivityDisplayDto(activity);
    }

    @PostMapping("/activity/bug")
    public ActivityDisplayDto createBugActivity(@RequestBody NewActivityDto newActivityDto){
        ActivityType type = activityTypeService.getTypeByName("bug");
        Activity activity = activityService.createNewActivity(type,newActivityDto);
        return activityDisplayDtoMapper.getActivityDisplayDto(activity);
    }

    @PostMapping("/activity/task")
    public ActivityDisplayDto createTaskActivity(@RequestBody NewActivityDto newActivityDto){
        ActivityType type = activityTypeService.getTypeByName("task");
        Activity activity = activityService.createNewActivity(type,newActivityDto);
        return activityDisplayDtoMapper.getActivityDisplayDto(activity);
    }

    @PostMapping("/activity/test_common")
    public ActivityDisplayDto createCommonActivity(@RequestBody NewActivityDto newActivityDto){
        ActivityType type = activityTypeService.getTypeByName("test_common");
        Activity activity = activityService.createNewActivity(type,newActivityDto);
        return activityDisplayDtoMapper.getActivityDisplayDto(activity);
    }

    @PostMapping("/activity/general")
    public ActivityDisplayDto createTestGeneralActivity(@RequestBody NewActivityDto newActivityDto){
        ActivityType type = activityTypeService.getTypeByName("general");
        Activity activity = activityService.createNewGeneralActivity(type,newActivityDto);
        return activityDisplayDtoMapper.getActivityDisplayDto(activity);
    }

    //  Get - Test_common activities/Project
    @GetMapping("activity/test_common/{projectId}")
    public void getProjectCommonActivities(@PathVariable("projectId") int projectId){

    }


    //  Get - General activities
    //  Get - Activity(id)

}
