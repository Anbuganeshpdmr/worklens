package com.pdmrindia.worklens.module_sprint_activity;

import com.pdmrindia.worklens.config.Permissions;
import com.pdmrindia.worklens.module_entry.mapperDtos.CloseWorkEntryDto;
import com.pdmrindia.worklens.module_sprint.Sprint;
import com.pdmrindia.worklens.module_sprint.SprintService;
import com.pdmrindia.worklens.module_sprint_activity.mapperDtos.CloseSprintActivityEntryDto;
import com.pdmrindia.worklens.module_sprint_activity.mapperDtos.SprintActivityDisplayDto;
import com.pdmrindia.worklens.module_sprint_activity.mapperDtos.SprintActivityDisplayDtoMapper;
import com.pdmrindia.worklens.module_sprint_activity.mapperDtos.SprintActivityManageListDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class SprintActivityController {


    private final SprintActivityService sprintActivityService;
    private final SprintActivityRepo sprintActivityRepo;
    private final SprintService sprintService;
    private final SprintActivityDisplayDtoMapper sprintActivityDisplayDtoMapper;

    @PreAuthorize(Permissions.FHTLUSER)
    @PutMapping("/sprint_activity/update")
    public void manageSprintActivities(@RequestBody SprintActivityManageListDto sprintActivityManageListDto){
        sprintActivityService.syncSprintActivities(sprintActivityManageListDto);
    }

    @PreAuthorize(Permissions.FHTLUSER)
    @GetMapping("/sprint_activity/sprint/{sprintId}/list")
    public List<Integer> getSprintActivitiesIdsList(@PathVariable("sprintId") int sprintId){
        Sprint sprint = sprintService.getSprintById(sprintId);
        List<SprintActivity> allowedList = sprintActivityRepo.findBySprintAndIsAllowed(sprint,true);
        return allowedList.stream().map(sa->sa.getActivity().getId()).toList();
    }

    @PreAuthorize(Permissions.FHTLUSER)
    @GetMapping("/sprint_activity/sprint/{sprintId}")
    public List<SprintActivityDisplayDto> getSprintActivitiesList(@PathVariable("sprintId") int sprintId){
        Sprint sprint = sprintService.getSprintById(sprintId);
        List<SprintActivity> allowedList = sprintActivityRepo.findBySprintAndIsAllowed(sprint,true);
        return allowedList.stream().map(sprintActivityDisplayDtoMapper::getSprintActivityDisplayDto).toList();
    }

    @PreAuthorize(Permissions.FHTLUSER)
    @GetMapping("/sprint_activity/{sprintActivityId}")
    public SprintActivityDisplayDto getSprintActivity(@PathVariable("sprintActivityId") int sprintActivityId){
        SprintActivity sprintActivity = sprintActivityService.getSprintActivityById(sprintActivityId);
        return sprintActivityDisplayDtoMapper.getSprintActivityDisplayDto(sprintActivity);
    }

    @PreAuthorize(Permissions.FHTLUSER)
    @PostMapping("/sprint_activity/{sprintActivityId}/start")
    public SprintActivityDisplayDto startSprintActivity(@PathVariable("sprintActivityId") int sprintActivityId){
        SprintActivity sprintActivity = sprintActivityService.startSprintActivity(sprintActivityId);
        return sprintActivityDisplayDtoMapper.getSprintActivityDisplayDto(sprintActivity);
    }

    @PreAuthorize(Permissions.FHTLUSER)
    @PostMapping("/sprint_activity/stop")
    public SprintActivityDisplayDto stopSprintActivity(@RequestBody CloseSprintActivityEntryDto dto){
        SprintActivity sprintActivity = sprintActivityService.closeSprintActivityWithEntry(dto);
        return sprintActivityDisplayDtoMapper.getSprintActivityDisplayDto(sprintActivity);
    }

}
