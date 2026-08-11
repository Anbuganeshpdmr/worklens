package com.pdmrindia.worklens.module_sprint;

import com.pdmrindia.worklens.module_sprint.mapperDtos.EditSprintDto;
import com.pdmrindia.worklens.module_sprint.mapperDtos.NewSprintReqDto;
import com.pdmrindia.worklens.module_sprint.mapperDtos.SprintDisplayDto;
import com.pdmrindia.worklens.module_sprint.mapperDtos.SprintDisplayDtoMapper;
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


    @PostMapping("/sprints")
    public SprintDisplayDto createSprint(@RequestBody NewSprintReqDto newSprintReqDto){
        Sprint createdSprint = sprintService.createNewSprint(newSprintReqDto);
        return sprintDisplayDtoMapper.getSprintDisplayDto(createdSprint);
    }

    @PutMapping("/sprints/{id}")
    public SprintDisplayDto editSprint(@PathVariable("id") int sprintId, @RequestBody EditSprintDto sprintDto){
        Sprint updatedSprint = sprintService.editSprint(sprintId,sprintDto);
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
        return sprintRepo.findAll().stream()
                .filter(s->s.getRecordStatus().getStatus().getName().equalsIgnoreCase("Active"))
                .map(sprintDisplayDtoMapper::getSprintDisplayDto)
                .toList();
    }
}
