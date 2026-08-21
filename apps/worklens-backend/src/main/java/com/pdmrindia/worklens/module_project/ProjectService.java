package com.pdmrindia.worklens.module_project;

import com.pdmrindia.worklens.exception.ProjectException;
import com.pdmrindia.worklens.module_project.mapperDtos.ProjectDto;
import com.pdmrindia.worklens.module_record.Record;
import com.pdmrindia.worklens.module_record.RecordService;
import com.pdmrindia.worklens.module_record_status.RecordStatus;
import com.pdmrindia.worklens.module_record_status.RecordStatusService;
import com.pdmrindia.worklens.module_user.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepo projectRepo;
    private final RecordStatusService recordStatusService;
    private final CurrentUserService currentUserService;

    public Project createNewProject(String projectName){
        Project project = new Project();
        project.setName(projectName);
        project.setCreatedBy(currentUserService.user());
        project.setCreatedOn(Instant.now());
        project.setRecordStatus(recordStatusService.getDefaultRecordStatus(Record.PROJECT));
        return projectRepo.save(project);
    }

    public Project editProject(int projectId, ProjectDto projectDto){
        Project project = getProjectById(projectId);
        project.setName(projectDto.getProjectName());

        RecordStatus updatedRecordStatus = recordStatusService.getRecordStatusById(projectDto.getSelectedRecordStatusId());
        recordStatusService.validateRecordStatusOfRecord(Record.PROJECT,updatedRecordStatus);

        project.setRecordStatus(updatedRecordStatus);
        return projectRepo.save(project);
    }

    public Project getProjectById(int id){
        return projectRepo.findById(id)
                .orElseThrow(()-> new ProjectException.ProjectNotFoundException("No Valid Project found"));
    }

}
