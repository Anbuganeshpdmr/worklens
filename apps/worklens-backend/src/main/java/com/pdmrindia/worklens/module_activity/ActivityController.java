package com.pdmrindia.worklens.module_activity;

import com.pdmrindia.worklens.module_activity.mapperDtos.*;
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

    @PostMapping("/activity/work")
    public ActivityDisplayDto createWorkActivity(@RequestBody NewWorkActivityDto newWorkActivityDto){
        Activity activity = activityService.createNewWorkActivity(newWorkActivityDto);
        return activityDisplayDtoMapper.getActivityDisplayDto(activity);
    }

    @PutMapping("/activity/work")
    public ActivityDisplayDto updateWorkActivity(@RequestBody UpdateWorkActivityDto updateWorkActivityDto){
        Activity activity = activityService.updateWorkActivity(updateWorkActivityDto);
        return activityDisplayDtoMapper.getActivityDisplayDto(activity);
    }

    @PostMapping("/activity/general")
    public ActivityDisplayDto createGeneralActivity(@RequestBody NewGeneralActivityDto newGeneralActivityDto){
        Activity activity = activityService.createNewGeneralActivity(newGeneralActivityDto);
        return activityDisplayDtoMapper.getActivityDisplayDto(activity);
    }

    @PutMapping("/activity/general")
    public ActivityDisplayDto updateGeneralActivity(@RequestBody UpdateGeneralActivityDto updateGeneralActivityDto){
        Activity activity = activityService.updateGeneralActivity(updateGeneralActivityDto);
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
        List<Activity> activityList = activityRepo.findByCategory(categoryService.getCategoryById(categoryId));
        return activityList.stream().map(activityDisplayDtoMapper::getActivityDisplayDto).toList();
    }

    @GetMapping("/activity/general")
    public List<ActivityDisplayDto> getNonTestActivities(){
        List<Activity> activityList = activityRepo.findByActivityType(activityTypeService.getTypeByName("general"));
        return activityList.stream().map(activityDisplayDtoMapper::getActivityDisplayDto).toList();
    }

}
