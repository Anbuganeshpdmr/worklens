package com.pdmrindia.worklens.module_sprint;

import com.pdmrindia.worklens.module_status.Record;
import com.pdmrindia.worklens.module_sprint.mapperDtos.EditSprintDto;
import com.pdmrindia.worklens.module_sprint.mapperDtos.NewSprintReqDto;
import com.pdmrindia.worklens.module_sprint.mapperDtos.SprintDisplayDto;
import com.pdmrindia.worklens.module_sprint.mapperDtos.SprintDisplayDtoMapper;
import com.pdmrindia.worklens.module_status.StatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class SprintController {

    private final SprintService sprintService;
    private final SprintDisplayDtoMapper sprintDisplayDtoMapper;
    private final SprintRepo sprintRepo;
    private final StatusService statusService;


    @PostMapping("/sprints")
    public SprintDisplayDto createSprint(@RequestBody NewSprintReqDto newSprintReqDto){
        Sprint createdSprint = sprintService.createNewSprint(newSprintReqDto);
        return sprintDisplayDtoMapper.getSprintDisplayDto(createdSprint);
    }

    @PutMapping("/sprints/{id}")
    public SprintDisplayDto editSprint(@RequestBody EditSprintDto sprintDto){
        Sprint updatedSprint = sprintService.editSprint(sprintDto);
        return sprintDisplayDtoMapper.getSprintDisplayDto(updatedSprint);
    }

    @GetMapping("/sprints/{id}")
    public SprintDisplayDto getSprint(@PathVariable("id") int sprintId){
        return sprintDisplayDtoMapper.getSprintDisplayDto(sprintService.getSprintById(sprintId));
    }

    @GetMapping("/sprints")
    public List<SprintDisplayDto> getAllSprints(){
        return sprintRepo.findAll().stream().map(sprintDisplayDtoMapper::getSprintDisplayDto).toList();
    }

    @GetMapping("/sprints/active")
    public List<SprintDisplayDto> getAllActiveSprints(){
        return sprintRepo.findByStatus(statusService.getRecordStatusByName(Record.SPRINT,"active"))
                .stream()
                .map(sprintDisplayDtoMapper::getSprintDisplayDto)
                .toList();
    }
}
