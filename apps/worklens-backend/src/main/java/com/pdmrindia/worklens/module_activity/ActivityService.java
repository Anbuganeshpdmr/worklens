package com.pdmrindia.worklens.module_activity;

import com.pdmrindia.worklens.exception.ActivityException;
import com.pdmrindia.worklens.module_activity.mapperDtos.NewGeneralActivityDto;
import com.pdmrindia.worklens.module_activity.mapperDtos.NewWorkActivityDto;
import com.pdmrindia.worklens.module_activity.mapperDtos.UpdateGeneralActivityDto;
import com.pdmrindia.worklens.module_activity.mapperDtos.UpdateWorkActivityDto;
import com.pdmrindia.worklens.module_activity_type.ActivityType;
import com.pdmrindia.worklens.module_activity_type.ActivityTypeService;
import com.pdmrindia.worklens.module_category.Category;
import com.pdmrindia.worklens.module_category.CategoryService;
import com.pdmrindia.worklens.module_project.Project;
import com.pdmrindia.worklens.module_project.ProjectService;
import com.pdmrindia.worklens.module_status.Record;
import com.pdmrindia.worklens.module_status.Status;
import com.pdmrindia.worklens.module_status.StatusService;
import com.pdmrindia.worklens.module_user.CurrentUserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepo activityRepo;
    private final CurrentUserService currentUserService;
    private final ProjectService projectService;
    private final StatusService statusService;
    private final ActivityTypeService activityTypeService;
    private final CategoryService categoryService;

    @Transactional
    public Activity createNewWorkActivity(NewWorkActivityDto newWorkActivityDto){
        Activity activity = new Activity();

        ActivityType type = activityTypeService.getTypeById(newWorkActivityDto.getTypeId());

        Category category;
        if(newWorkActivityDto.getCategoryId() != null){
            category = categoryService.getCategoryById(newWorkActivityDto.getCategoryId());
        }else{
            category = categoryService.getCategoryByName("sprint-testing");
        }

        activity.setCategory(category);

        activity.setActivityType(type);
        activity.setCreatedBy(currentUserService.user());
        activity.setCreatedOn(Instant.now());

        Status thisStatus = statusService.getRecordStatusByName(Record.ACTIVITY,"ready");
        //Status thisStatus = statusService.getStatusById(newWorkActivityDto.getStatusId());
        statusService.validateRecordStatusOfRecord(Record.ACTIVITY,thisStatus);
        activity.setStatus(thisStatus);

        activity.setTitle(newWorkActivityDto.getTitle());
        activity.setDescription(newWorkActivityDto.getDescription());

        Project project = projectService.getProjectById(newWorkActivityDto.getProjectId());
        activity.setProject(project);

        Integer externalTicketId = newWorkActivityDto.getExternalTicketId();
        activity.setExternalTicketId(externalTicketId);

        if(newWorkActivityDto.getParentActivityId() != null){
            Activity parentActivity = getActivityById(newWorkActivityDto.getParentActivityId());
            validateParentActivityProject(parentActivity,project);
            //validateParentActivityHierarchy()
            activity.setParentActivity(parentActivity);
            parentActivity.getChildActivities().add(activity);
        }

        return activityRepo.save(activity);
    }

    @Transactional
    public Activity updateWorkActivity(UpdateWorkActivityDto updateWorkActivityDto){
        Activity activity = getActivityById(updateWorkActivityDto.getActivityId());

        //  Check status to allowed
        validateEditableStatus(activity);

        //  Edit fields
        ActivityType type = activityTypeService.getTypeById(updateWorkActivityDto.getTypeId());
        /*if(!type.getCategory().getName().toLowerCase().contains("sprint-testing")){
            throw new ActivityException.TestCategoryMismatchException("Select type from testing category");
        }*/
        activity.setActivityType(type);

        Category category = categoryService.getCategoryById(updateWorkActivityDto.getCategoryId());
        activity.setCategory(category);

        activity.setUpdatedBy(currentUserService.user());
        activity.setUpdatedOn(Instant.now());
        activity.setTitle(updateWorkActivityDto.getTitle());
        activity.setDescription(updateWorkActivityDto.getDescription());

        Integer externalTicketId = updateWorkActivityDto.getExternalTicketId();
        activity.setExternalTicketId(externalTicketId);

        //  Version check
        if(!updateWorkActivityDto.getVersion().equals(activity.getVersion())){
            throw new ActivityException.VersionMismatchException("Please Refresh the data to edit further.");
        }
        System.out.println("Trial version: "+updateWorkActivityDto.getVersion());

        //  validate and set Parent Activity
        if(updateWorkActivityDto.getParentActivityId() != null && updateWorkActivityDto.getParentActivityId() > 0){
            // validate parent
            validateNotInHierarchy(activity,updateWorkActivityDto.getParentActivityId());

            Activity parentActivity = getActivityById(updateWorkActivityDto.getParentActivityId());
            validateParentActivityProject(parentActivity, activity.getProject());

            activity.setParentActivity(parentActivity);
            parentActivity.getChildActivities().add(activity);
        }else {
            activity.setParentActivity(null);
        }

        return activityRepo.save(activity);
    }

    private void validateNotInHierarchy(Activity activity, Integer targetId) {
        if (activity.getId().equals(targetId)) {
            throw new ActivityException.ParentIsInHierarchyException("Activity already exists in the hierarchy");
        }

        if (activity.getChildActivities() == null) {
            return;
        }

        for (Activity child : activity.getChildActivities()) {
            validateNotInHierarchy(child, targetId);
        }
    }

    private void validateEditableStatus(Activity activity){
        if(!activity.getStatus().getDisplayName().equalsIgnoreCase("ready")){
            throw new ActivityException.ActivityNotEditableException("Test Activity is now either locked or retired to Edit");
        }
    }

    @Transactional
    public Activity createNewGeneralActivity(NewGeneralActivityDto newGeneralActivityDto){
        Activity activity = new Activity();

        ActivityType type = activityTypeService.getTypeByName("general");
        activity.setActivityType(type);

        Category category = categoryService.getCategoryById(newGeneralActivityDto.getCategoryId());
        activity.setCategory(category);

        activity.setCreatedBy(currentUserService.user());
        activity.setCreatedOn(Instant.now());

        Status thisStatus = statusService.getRecordStatusByName(Record.ACTIVITY,"ready");
        activity.setStatus(thisStatus);

        activity.setTitle(newGeneralActivityDto.getTitle());
        activity.setDescription(newGeneralActivityDto.getDescription());

        return activityRepo.save(activity);
    }

    @Transactional
    public Activity updateGeneralActivity(UpdateGeneralActivityDto updateGeneralActivityDto){
        Activity activity = getActivityById(updateGeneralActivityDto.getActivityId());

        if(!updateGeneralActivityDto.getVersion().equals(activity.getVersion())){
            throw new ActivityException.VersionMismatchException("Please Reload the data to edit further.");
        }

        Category category = categoryService.getCategoryById(updateGeneralActivityDto.getCategoryId());
        activity.setCategory(category);

        activity.setUpdatedBy(currentUserService.user());
        activity.setUpdatedOn(Instant.now());
        activity.setTitle(updateGeneralActivityDto.getTitle());
        activity.setDescription(updateGeneralActivityDto.getDescription());

        return activityRepo.save(activity);
    }

    public void validateParentActivityProject(Activity parentActivity, Project project){
        if(parentActivity.getProject()!=project){
            throw new ActivityException.ParentActivityProjectMismatchException("Parent Activity Project Mismatch");
        }
    }

    public Activity getActivityById(int activityId){
        return activityRepo.findById(activityId).orElseThrow(()-> new ActivityException.ActivityNotFoundException("Activity Not Found"));
    }

    @Transactional
    public Activity updateRecordStatus(Activity activity, Status status){
        statusService.validateRecordStatusOfRecord(Record.ACTIVITY,status);
        activity.setStatus(status);
        return activityRepo.save(activity);
    }

    @Transactional
    public Activity processActivityStatusForEntry(Activity activity){

        if(activity.getStatus().getDisplayName().equalsIgnoreCase("retired")){
            throw new ActivityException.ActivityRetiredException("Activity already Retired!");

        } else if (activity.getStatus().getDisplayName().equalsIgnoreCase("ready")) {
            return updateRecordStatus(activity, statusService.getRecordStatusByName(Record.ACTIVITY, "locked"));
        }
        return activity;
    }

    /*private void validateTypeAndCategory(Category category, ActivityType type) {
        if(type.getCategory()!=category){
            throw new CategoryException.CategoryTypeMismatchException("Please select valid type under category");
        }
    }*/
}
