package com.pdmrindia.worklens.module_sprint_activity;

import com.pdmrindia.worklens.exception.SprintActivityException;
import com.pdmrindia.worklens.exception.SprintException;
import com.pdmrindia.worklens.module_activity.Activity;
import com.pdmrindia.worklens.module_activity.ActivityService;
import com.pdmrindia.worklens.module_activity.mapperDtos.NewTestActivityDto;
import com.pdmrindia.worklens.module_activity_type.ActivityType;
import com.pdmrindia.worklens.module_project.Project;
import com.pdmrindia.worklens.module_sprint_activity.mapperDtos.SprintActivityManageListDto;
import com.pdmrindia.worklens.module_status.Record;
import com.pdmrindia.worklens.module_sprint.Sprint;
import com.pdmrindia.worklens.module_sprint.SprintService;
import com.pdmrindia.worklens.module_sprint_activity.mapperDtos.NewSprintNonTestActivityDto;
import com.pdmrindia.worklens.module_status.Status;
import com.pdmrindia.worklens.module_status.StatusService;
import com.pdmrindia.worklens.module_user.CurrentUserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SprintActivityService {

    private final SprintActivityRepo sprintActivityRepo;
    private final ActivityService activityService;
    private final SprintService sprintService;
    private final StatusService statusService;
    private final CurrentUserService currentUserService;

    /*
    selected - May be new
    selected - previously unselected
    selected - previously selected
    unselected - not get selected from beginning
    unselected - not get selected - but had Sprint-Activity data with allowed=false
    unselected - previously selected
     */
    @Transactional
    public void syncSprintActivities(SprintActivityManageListDto sprintActivityManageListDto) {
        Sprint sprint = sprintService.getSprintById(sprintActivityManageListDto.getSprintId());
        List<SprintActivity> existingSprintActivities = sprintActivityRepo.findBySprint(sprint);

        Map<Integer,SprintActivity> existingMap = existingSprintActivities.stream()
                .collect(Collectors.toMap(sa->sa.getActivity().getId(), Function.identity()));

        Set<Integer> requestedIds = new HashSet<>(sprintActivityManageListDto.getRequestedActivityIds());
        for (Integer activityId : requestedIds) {

            SprintActivity existing = existingMap.get(activityId);
            Activity activity = activityService.getActivityById(activityId);

            if (existing == null) {

                // Previously never associated
                createNewSprintActivity(sprint,activity);

            } else if (!existing.isAllowed()) {

                // Previously removed
                existing.setAllowed(true);

            }

            // If already allowed → nothing to do
        }

        for (SprintActivity existing : existingSprintActivities) {

            Integer activityId = existing.getActivity().getId();

            if (existing.isAllowed() && !requestedIds.contains(activityId)) {
                existing.setAllowed(false);
            }
        }
    }

    private void validateProjectOfActivities(Activity activity, Sprint sprint){
        if(activity.getProject() != sprint.getProject()){
            throw new SprintActivityException.SprintAndActivityProjectMismatchException("Activity must be under same project of Sprint");
        }
    }

    private SprintActivity createNewSprintActivity(Sprint sprint, Activity activity){

        validateProjectOfActivities(activity,sprint);
        SprintActivity sprintActivity = new SprintActivity();
        sprintActivity.setSprint(sprint);
        sprintActivity.setActivity(activity);
        sprintActivity.setStatus(statusService.getRecordStatusByName(Record.SPRINT_ACTIVITY,"un-tested"));
        sprintActivity.setCreatedBy(currentUserService.user());
        sprintActivity.setCreatedOn(Instant.now());
        sprintActivity.setAllowed(true);
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

    @Transactional
    public SprintActivity updateStatus(SprintActivity sprintActivity, Status status){
        statusService.validateRecordStatusOfRecord(Record.SPRINT_ACTIVITY,status);
        sprintActivity.setStatus(status);
        return sprintActivityRepo.save(sprintActivity);
    }



}
