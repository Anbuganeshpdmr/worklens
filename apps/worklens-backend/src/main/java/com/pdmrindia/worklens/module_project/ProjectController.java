package com.pdmrindia.worklens.module_project;

import com.pdmrindia.worklens.module_project.mapperDtos.ProjectDisplayDto;
import com.pdmrindia.worklens.module_project.mapperDtos.ProjectDisplayDtoMapper;
import com.pdmrindia.worklens.module_project.mapperDtos.ProjectDto;
import com.pdmrindia.worklens.module_status.Record;
import com.pdmrindia.worklens.module_status.StatusService;
import lombok.RequiredArgsConstructor;
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

    @PostMapping("/projects")
    public ProjectDisplayDto createProject(@RequestParam String projectName){
        Project createdProject = projectService.createNewProject(projectName);
        return projectDisplayDtoMapper.getProjectDisplayDto(createdProject);
    }

    @PutMapping("/projects/{id}")
    public ProjectDisplayDto editProject(@PathVariable("id") int projectId, @RequestBody ProjectDto projectDto){
        Project updatedProject = projectService.editProject(projectId,projectDto);
        return projectDisplayDtoMapper.getProjectDisplayDto(updatedProject);
    }

    @GetMapping("/projects/{id}")
    public ProjectDisplayDto getProject(@PathVariable("id") int projectId){
        return projectDisplayDtoMapper.getProjectDisplayDto(projectService.getProjectById(projectId));
    }

    @GetMapping("/projects")
    public List<ProjectDisplayDto> getAllProjects(){
        return projectRepo.findAll().stream().map(projectDisplayDtoMapper::getProjectDisplayDto).toList();
    }

    @GetMapping("/projects/active")
    public List<ProjectDisplayDto> getAllActiveProjects(){
        return projectRepo.findByStatus(statusService.getRecordStatusByName(Record.PROJECT,"active"))
                .stream()
                .map(projectDisplayDtoMapper::getProjectDisplayDto)
                .toList();
    }
}
