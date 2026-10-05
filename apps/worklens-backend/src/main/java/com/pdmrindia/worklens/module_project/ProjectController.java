package com.pdmrindia.worklens.module_project;

import com.pdmrindia.worklens.config.Permissions;
import com.pdmrindia.worklens.module_project.mapperDtos.ProjectDisplayDto;
import com.pdmrindia.worklens.module_project.mapperDtos.ProjectDisplayDtoMapper;
import com.pdmrindia.worklens.module_project.mapperDtos.ProjectDto;
import com.pdmrindia.worklens.module_status.Record;
import com.pdmrindia.worklens.module_status.StatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final ProjectDisplayDtoMapper projectDisplayDtoMapper;
    private final ProjectRepo projectRepo;
    private final StatusService statusService;

    @PreAuthorize(Permissions.FHTL)
    @PostMapping("/projects")
    public ProjectDisplayDto createProject(@RequestParam String projectName){
        Project createdProject = projectService.createNewProject(projectName);
        return projectDisplayDtoMapper.getProjectDisplayDto(createdProject);
    }

    @PreAuthorize(Permissions.FHTL)
    @PutMapping("/projects/{id}")
    public ProjectDisplayDto editProject(@PathVariable("id") int projectId, @RequestBody ProjectDto projectDto){
        Project updatedProject = projectService.editProject(projectId,projectDto);
        return projectDisplayDtoMapper.getProjectDisplayDto(updatedProject);
    }

    @PreAuthorize(Permissions.FHTLUSER)
    @GetMapping("/projects/{id}")
    public ProjectDisplayDto getProject(@PathVariable("id") int projectId){
        return projectDisplayDtoMapper.getProjectDisplayDto(projectService.getProjectById(projectId));
    }

    @PreAuthorize(Permissions.FHTLUSER)
    @GetMapping("/projects")
    public List<ProjectDisplayDto> getAllProjects(){
        return projectRepo.findAll().stream().map(projectDisplayDtoMapper::getProjectDisplayDto).toList();
    }

    @PreAuthorize(Permissions.FHTLUSER)
    @GetMapping("/projects/active")
    public List<ProjectDisplayDto> getAllActiveProjects(){
        return projectRepo.findByStatus(statusService.getRecordStatusByName(Record.PROJECT,"active"))
                .stream()
                .map(projectDisplayDtoMapper::getProjectDisplayDto)
                .toList();
    }
}
