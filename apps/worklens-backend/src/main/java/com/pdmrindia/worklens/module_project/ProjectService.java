package com.pdmrindia.worklens.module_project;

import com.pdmrindia.worklens.exception.ProjectException;
import com.pdmrindia.worklens.module_project.mapperDtos.ProjectDto;
import com.pdmrindia.worklens.module_status.Record;
import com.pdmrindia.worklens.module_status.Status;
import com.pdmrindia.worklens.module_status.StatusService;
import com.pdmrindia.worklens.module_user.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepo projectRepo;
    private final StatusService statusService;
    private final CurrentUserService currentUserService;

    public Project createNewProject(String projectName){
        Project project = new Project();
        project.setName(projectName);
        project.setCreatedBy(currentUserService.user());
        project.setCreatedOn(Instant.now());
        project.setStatus(statusService.getRecordStatusByName(Record.PROJECT,"active"));
        return projectRepo.save(project);
    }

    public Project editProject(int projectId, ProjectDto projectDto){
        Project project = getProjectById(projectId);
        project.setName(projectDto.getProjectName());

        Status updatedStatus = statusService.getStatusById(projectDto.getSelectedStatusId());
        statusService.validateRecordStatusOfRecord(Record.PROJECT,updatedStatus);
        project.setStatus(updatedStatus);

        return projectRepo.save(project);
    }

    public Project getProjectById(int id){
        return projectRepo.findById(id)
                .orElseThrow(()-> new ProjectException.ProjectNotFoundException("No Valid Project found"));
    }

}
