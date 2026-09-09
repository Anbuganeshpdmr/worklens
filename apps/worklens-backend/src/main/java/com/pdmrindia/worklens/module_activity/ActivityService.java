package com.pdmrindia.worklens.module_activity;

import com.pdmrindia.worklens.exception.ActivityException;
import com.pdmrindia.worklens.exception.CategoryException;
import com.pdmrindia.worklens.module_activity.mapperDtos.NewNonTestActivityDto;
import com.pdmrindia.worklens.module_activity.mapperDtos.NewTestActivityDto;
import com.pdmrindia.worklens.module_activity.mapperDtos.UpdateTestActivityDto;
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
import java.util.List;
import java.util.Objects;

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
    public Activity createNewTestActivity(NewTestActivityDto newTestActivityDto){
        Activity activity = new Activity();

        ActivityType type = activityTypeService.getTypeById(newTestActivityDto.getTypeId());
        if(!type.getCategory().getName().toLowerCase().contains("sprint-testing")){
            throw new ActivityException.TestCategoryMismatchException("Select type from testing category");
        }
        activity.setActivityType(type);
        activity.setCreatedBy(currentUserService.user());
        activity.setCreatedOn(Instant.now());

        Status thisStatus = statusService.getRecordStatusByName(Record.ACTIVITY,"ready");
        //Status thisStatus = statusService.getStatusById(newTestActivityDto.getStatusId());
        statusService.validateRecordStatusOfRecord(Record.ACTIVITY,thisStatus);
        activity.setStatus(thisStatus);

        activity.setTitle(newTestActivityDto.getTitle());
        activity.setDescription(newTestActivityDto.getDescription());

        Project project = projectService.getProjectById(newTestActivityDto.getProjectId());
        activity.setProject(project);

        Integer externalTicketId = newTestActivityDto.getExternalTicketId();
        activity.setExternalTicketId(externalTicketId);

        if(newTestActivityDto.getParentActivityId() != null){
            Activity parentActivity = getActivityById(newTestActivityDto.getParentActivityId());
            validateParentActivityProject(parentActivity,project);
            //validateParentActivityHierarchy()
            activity.setParentActivity(parentActivity);
            parentActivity.getChildActivities().add(activity);
        }

        return activityRepo.save(activity);
    }

    @Transactional
    public Activity updateTestActivity(UpdateTestActivityDto updateTestActivityDto){
        Activity activity = getActivityById(updateTestActivityDto.getActivityId());

        //  Check status to allowed
        validateEditableStatus(activity);

        //  Edit fields
        ActivityType type = activityTypeService.getTypeById(updateTestActivityDto.getTypeId());
        if(!type.getCategory().getName().toLowerCase().contains("sprint-testing")){
            throw new ActivityException.TestCategoryMismatchException("Select type from testing category");
        }
        activity.setActivityType(type);
        activity.setUpdatedBy(currentUserService.user());
        activity.setUpdatedOn(Instant.now());
        activity.setTitle(updateTestActivityDto.getTitle());
        activity.setDescription(updateTestActivityDto.getDescription());

        Integer externalTicketId = updateTestActivityDto.getExternalTicketId();
        activity.setExternalTicketId(externalTicketId);

        //  Version check
        if(!updateTestActivityDto.getVersion().equals(activity.getVersion())){
            throw new ActivityException.VersionMismatchException("Please Refresh the data to edit further.");
        }
        System.out.println("Trial version: "+updateTestActivityDto.getVersion());

        //  validate and set Parent Activity
        if(updateTestActivityDto.getParentActivityId() != null && updateTestActivityDto.getParentActivityId() > 0){
            // validate parent
            validateNotInHierarchy(activity,updateTestActivityDto.getParentActivityId());

            Activity parentActivity = getActivityById(updateTestActivityDto.getParentActivityId());
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
    public Activity createNewNonTestActivity(NewNonTestActivityDto newNonTestActivityDto){
        Activity activity = new Activity();

        Category category = categoryService.getCategoryById(newNonTestActivityDto.getCategoryId());
        ActivityType type = activityTypeService.getTypeById(newNonTestActivityDto.getTypeId());
        if(type.getCategory().getName().toLowerCase().contains("sprint-testing")){
            throw new ActivityException.TestCategoryMismatchException("Select type from Non-testing category");
        }
        validateTypeAndCategory(category,type);

        activity.setActivityType(type);
        activity.setCreatedBy(currentUserService.user());
        activity.setCreatedOn(Instant.now());

        Status thisStatus = statusService.getRecordStatusByName(Record.ACTIVITY,"ready");
        activity.setStatus(thisStatus);

        activity.setTitle(newNonTestActivityDto.getTitle());
        activity.setDescription(newNonTestActivityDto.getDescription());

        Project project = newNonTestActivityDto.getProjectId() != null ? projectService.getProjectById(newNonTestActivityDto.getProjectId()) : null;
        activity.setProject(project);

        return activityRepo.save(activity);
    }

    private void validateTypeAndCategory(Category category, ActivityType type) {
        if(type.getCategory()!=category){
            throw new CategoryException.CategoryTypeMismatchException("Please select valid type under category");
        }
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
}
