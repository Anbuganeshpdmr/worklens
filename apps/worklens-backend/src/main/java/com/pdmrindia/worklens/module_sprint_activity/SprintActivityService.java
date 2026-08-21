package com.pdmrindia.worklens.module_sprint_activity;

import com.pdmrindia.worklens.exception.SprintActivityException;
import com.pdmrindia.worklens.exception.SprintException;
import com.pdmrindia.worklens.module_activity.Activity;
import com.pdmrindia.worklens.module_activity.ActivityService;
import com.pdmrindia.worklens.module_activity.mapperDtos.NewActivityDto;
import com.pdmrindia.worklens.module_activity_type.ActivityType;
import com.pdmrindia.worklens.module_project.Project;
import com.pdmrindia.worklens.module_record.Record;
import com.pdmrindia.worklens.module_record_status.RecordStatus;
import com.pdmrindia.worklens.module_record_status.RecordStatusService;
import com.pdmrindia.worklens.module_sprint.Sprint;
import com.pdmrindia.worklens.module_sprint.SprintService;
import com.pdmrindia.worklens.module_sprint_activity.mapperDtos.NewSprintActivityDto;
import com.pdmrindia.worklens.module_user.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SprintActivityService {

    private final SprintActivityRepo sprintActivityRepo;
    private final ActivityService activityService;
    private final SprintService sprintService;
    private final RecordStatusService recordStatusService;
    private final CurrentUserService currentUserService;

    public SprintActivity createNewSprintActivity(ActivityType activityType, NewSprintActivityDto newSprintActivityDto){

        Activity createdActivity = activityService.createNewActivity(activityType, newSprintActivityDto);

        SprintActivity sprintActivity = new SprintActivity();
        sprintActivity.setActivity(createdActivity);
        sprintActivity.setRecordStatus(recordStatusService.getDefaultRecordStatus(Record.SPRINT_ACTIVITY));

        sprintActivity.setCreatedBy(currentUserService.user());
        sprintActivity.setCreatedOn(Instant.now());

        Sprint sprint = sprintService.getSprintById(newSprintActivityDto.getSprintId());
        validSprintProjectMatch(sprint, createdActivity.getProject());
        sprintActivity.setSprint(sprint);

        return sprintActivityRepo.save(sprintActivity);
    }

    private void validSprintProjectMatch(Sprint sprint, Project project){
        if(!sprint.getProject().getId().equals(project.getId())){
            throw new SprintException.SprintProjectMismatchException("selected Sprint not allowed in this project");
        }
    }

    public List<SprintActivity> getAllSprintActivities(int sprintId) {
        Sprint sprint = sprintService.getSprintById(sprintId);
        return sprintActivityRepo.findBySprint(sprint);
    }

    public List<SprintActivity> getChildSprintActivities(int sprintActivityId) {
        SprintActivity sprintActivity = getSprintActivityById(sprintActivityId);
        List<Activity> childActivities = sprintActivity.getActivity().getChildActivities();
        Sprint sprint = sprintActivity.getSprint();

        return sprintActivityRepo.findBySprintAndActivityIn(sprint, childActivities);
    }

    public SprintActivity getSprintActivityById(int sprintActivityId){
        return sprintActivityRepo.findById(sprintActivityId)
                .orElseThrow(()->new SprintActivityException.SprintActivityNotFoundException("No Valid Sprint Activity Found"));
    }
}
