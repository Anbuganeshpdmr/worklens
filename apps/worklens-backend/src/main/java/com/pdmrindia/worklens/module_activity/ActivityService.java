package com.pdmrindia.worklens.module_activity;

import com.pdmrindia.worklens.exception.ActivityException;
import com.pdmrindia.worklens.module_activity.mapperDtos.NewActivityDto;
import com.pdmrindia.worklens.module_activity_type.ActivityType;
import com.pdmrindia.worklens.module_project.Project;
import com.pdmrindia.worklens.module_project.ProjectService;
import com.pdmrindia.worklens.module_record.Record;
import com.pdmrindia.worklens.module_record_status.RecordStatusService;
import com.pdmrindia.worklens.module_user.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepo activityRepo;
    private final CurrentUserService currentUserService;
    private final ProjectService projectService;
    private final RecordStatusService recordStatusService;

    public Activity createNewActivity(ActivityType activityType, NewActivityDto newActivityDto){
        Activity activity = new Activity();

        activity.setActivityType(activityType);
        activity.setCreatedBy(currentUserService.user());
        activity.setCreatedOn(Instant.now());

        activity.setRecordStatus(recordStatusService.getDefaultRecordStatus(Record.ACTIVITY));

        activity.setTitle(newActivityDto.getTitle());
        activity.setDescription(newActivityDto.getDescription());

        Project project = newActivityDto.getProjectId() != null ? projectService.getProjectById(newActivityDto.getProjectId()) : null;
        activity.setProject(project);

        Integer externalTicketId = newActivityDto.getLinkedTicketId();
        activity.setExternalTicketId(externalTicketId);

        if(newActivityDto.getParentActivityId() != null){
            Activity parentActivity = getActivityById(newActivityDto.getParentActivityId());
            validateParentActivityProject(parentActivity,project);

            activity.setParentActivity(parentActivity);
            parentActivity.getChildActivities().add(activity);
        }

        return activityRepo.save(activity);
    }

    public Activity createNewGeneralActivity(ActivityType activityType, NewActivityDto newActivityDto){
        Activity activity = new Activity();

        activity.setActivityType(activityType);
        activity.setCreatedBy(currentUserService.user());
        activity.setCreatedOn(Instant.now());

        activity.setRecordStatus(recordStatusService.getDefaultRecordStatus(Record.ACTIVITY));

        activity.setTitle(newActivityDto.getTitle());
        activity.setDescription(newActivityDto.getDescription());

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
}
