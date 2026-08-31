package com.pdmrindia.worklens.module_activity;

import com.pdmrindia.worklens.module_activity.mapperDtos.ActivityDisplayDto;
import com.pdmrindia.worklens.module_activity.mapperDtos.ActivityDisplayDtoMapper;
import com.pdmrindia.worklens.module_activity.mapperDtos.NewNonTestActivityDto;
import com.pdmrindia.worklens.module_activity.mapperDtos.NewTestActivityDto;
import com.pdmrindia.worklens.module_activity_type.ActivityTypeService;
import com.pdmrindia.worklens.module_category.CategoryService;
import com.pdmrindia.worklens.module_project.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;
    private final ActivityRepo activityRepo;
    private final ActivityDisplayDtoMapper activityDisplayDtoMapper;
    private final ProjectService projectService;
    private final ActivityTypeService activityTypeService;
    private final CategoryService categoryService;

    @PostMapping("/activity/test")
    public ActivityDisplayDto createTestingActivity(@RequestBody NewTestActivityDto newTestActivityDto){
        Activity activity = activityService.createNewTestActivity(newTestActivityDto);
        return activityDisplayDtoMapper.getActivityDisplayDto(activity);
    }

    @PostMapping("/activity/non-test")
    public ActivityDisplayDto createNonTestingActivity(@RequestBody NewNonTestActivityDto newNonTestActivityDto){
        Activity activity = activityService.createNewNonTestActivity(newNonTestActivityDto);
        return activityDisplayDtoMapper.getActivityDisplayDto(activity);
    }

    @GetMapping("/activity/project/{projectId}")
    public List<ActivityDisplayDto> getActivitiesByProject(@PathVariable("projectId") int projectId){
        List<Activity> activityList = activityRepo.findByProject(projectService.getProjectById(projectId));
        return activityList.stream().map(activityDisplayDtoMapper::getActivityDisplayDto).toList();
    }

    @GetMapping("/activity/type/{typeId}")
    public List<ActivityDisplayDto> getActivitiesByType(@PathVariable("typeId") int typeId){
        List<Activity> activityList = activityRepo.findByActivityType(activityTypeService.getTypeById(typeId));
        return activityList.stream().map(activityDisplayDtoMapper::getActivityDisplayDto).toList();
    }

    @GetMapping("/activity/category/{categoryId}")
    public List<ActivityDisplayDto> getActivitiesByCategory(@PathVariable("categoryId") int categoryId){
        List<Activity> activityList = activityRepo.findByActivityType_Category(categoryService.getCategoryById(categoryId));
        return activityList.stream().map(activityDisplayDtoMapper::getActivityDisplayDto).toList();
    }

}
