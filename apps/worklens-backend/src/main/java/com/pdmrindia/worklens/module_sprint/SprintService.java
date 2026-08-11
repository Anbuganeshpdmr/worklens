package com.pdmrindia.worklens.module_sprint;

import com.pdmrindia.worklens.exception.ProjectException;
import com.pdmrindia.worklens.exception.SprintException;
import com.pdmrindia.worklens.module_project.Project;
import com.pdmrindia.worklens.module_project.ProjectService;
import com.pdmrindia.worklens.module_project.mapperDtos.ProjectDto;
import com.pdmrindia.worklens.module_record.Record;
import com.pdmrindia.worklens.module_record_status.RecordStatus;
import com.pdmrindia.worklens.module_record_status.RecordStatusService;
import com.pdmrindia.worklens.module_sprint.mapperDtos.EditSprintDto;
import com.pdmrindia.worklens.module_sprint.mapperDtos.NewSprintReqDto;
import com.pdmrindia.worklens.module_user.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class SprintService {

    private final SprintRepo sprintRepo;
    private final ProjectService projectService;
    private final RecordStatusService recordStatusService;
    private final CurrentUserService currentUserService;

    public Sprint createNewSprint(NewSprintReqDto dto){
        Sprint sprint = new Sprint();

        sprint.setName(dto.getSprintName());
        sprint.setProject(projectService.getProjectById(dto.getProjectId()));
        sprint.setCreatedBy(currentUserService.user());
        sprint.setCreatedOn(Instant.now());
        sprint.setRecordStatus(recordStatusService.getDefaultRecordStatus(Record.SPRINT));

        return sprintRepo.save(sprint);
    }

    public Sprint editSprint(int sprintId, EditSprintDto editSprintDto){

        Sprint sprint = getSprintById(sprintId);
        sprint.setName(editSprintDto.getSprintName());

        RecordStatus updatedRecordStatus = recordStatusService.getRecordStatusById(editSprintDto.getSelectedRecordStatusId());
        recordStatusService.validateRecordStatusOfRecord(Record.SPRINT,updatedRecordStatus);

        sprint.setRecordStatus(updatedRecordStatus);
        return sprintRepo.save(sprint);
    }

    public Sprint getSprintById(int id){
        return sprintRepo.findById(id)
                .orElseThrow(()-> new SprintException.SprintNotFoundException("No Valid Sprint found"));
    }
}
