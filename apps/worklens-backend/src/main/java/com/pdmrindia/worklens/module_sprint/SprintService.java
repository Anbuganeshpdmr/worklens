package com.pdmrindia.worklens.module_sprint;


import com.pdmrindia.worklens.exception.SprintException;
import com.pdmrindia.worklens.module_project.ProjectService;
import com.pdmrindia.worklens.module_status.Record;
import com.pdmrindia.worklens.module_sprint.mapperDtos.EditSprintDto;
import com.pdmrindia.worklens.module_sprint.mapperDtos.NewSprintReqDto;
import com.pdmrindia.worklens.module_status.Status;
import com.pdmrindia.worklens.module_status.StatusService;
import com.pdmrindia.worklens.module_user.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class SprintService {

    private final SprintRepo sprintRepo;
    private final ProjectService projectService;
    private final CurrentUserService currentUserService;
    private final StatusService statusService;

    public Sprint createNewSprint(NewSprintReqDto dto){
        Sprint sprint = new Sprint();

        sprint.setName(dto.getSprintName());
        sprint.setProject(projectService.getProjectById(dto.getProjectId()));
        sprint.setCreatedBy(currentUserService.user());
        sprint.setCreatedOn(Instant.now());
        sprint.setStatus(statusService.getRecordStatusByName(Record.SPRINT,"active"));

        return sprintRepo.save(sprint);
    }

    public Sprint editSprint(EditSprintDto editSprintDto){

        Sprint sprint = getSprintById(editSprintDto.getSprintId());
        sprint.setName(editSprintDto.getSprintName());

        Status updatedStatus = statusService.getStatusById(editSprintDto.getSelectedStatusId());
        statusService.validateRecordStatusOfRecord(Record.SPRINT,updatedStatus);
        sprint.setStatus(updatedStatus);

        return sprintRepo.save(sprint);
    }

    public Sprint getSprintById(int id){
        return sprintRepo.findById(id)
                .orElseThrow(()-> new SprintException.SprintNotFoundException("No Valid Sprint found"));
    }
}
