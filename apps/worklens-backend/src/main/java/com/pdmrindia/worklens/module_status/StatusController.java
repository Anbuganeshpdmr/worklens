package com.pdmrindia.worklens.module_status;

import com.pdmrindia.worklens.module_status.mapperDtos.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class StatusController {

    private final StatusService statusService;
    private final StatusRepo statusRepo;
    private final StatusDisplayDtoMapper statusDisplayDtoMapper;

    @PostMapping("/status")
    public StatusDisplayDto addNewStatus(@RequestBody NewStatusDto newStatusDto){
        Status status = statusService.createOptionalStatus(newStatusDto);
        return statusDisplayDtoMapper.getStatusDisplayDto(status);
    }

    @PutMapping("/status/meta")
    public StatusDisplayDto editStatusMeta(@RequestBody UpdateStatusMetaDto updateStatusMetaDto){
        Status status = statusService.updateStatusMeta(updateStatusMetaDto);
        return statusDisplayDtoMapper.getStatusDisplayDto(status);
    }

    @PutMapping("/status/records")
    public List<StatusDisplayDto> editRecordStatuses(@RequestBody UpdateRecordStatusesDto updateRecordStatusesDto){
        List<Status> statusList = statusService.updateRecordStatuses(updateRecordStatusesDto);
        return statusList.stream().map(statusDisplayDtoMapper::getStatusDisplayDto).collect(Collectors.toList());
    }

    @GetMapping("/status/all")
    public List<StatusDisplayDto> getAllStatus(){
        List<Status> statusList = statusRepo.findAll();
        return statusList.stream().map(statusDisplayDtoMapper::getStatusDisplayDto).collect(Collectors.toList());
    }

    @GetMapping("/status/{id}")
    public StatusDisplayDto getStatus(@PathVariable("id") int id){
        Status status = statusService.getStatusById(id);
        return statusDisplayDtoMapper.getStatusDisplayDto(status);
    }

    @GetMapping("/status/records/{recordName}")
    public List<StatusDisplayDto> getAllStatusesForRecord(@PathVariable("recordName") String recordName){
        Record record = Record.valueOf(recordName.toUpperCase());
        List<Status> recordStatusList = statusRepo.findByRecord(record);
        return recordStatusList.stream().map(statusDisplayDtoMapper::getStatusDisplayDto).collect(Collectors.toList());
    }

    @GetMapping("/status/records/{recordName}/applicable")
    public List<StatusDisplayDto> getApplicableStatusesForRecord(@PathVariable("recordName") String recordName){
        Record record = Record.valueOf(recordName.toUpperCase());
        List<Status> recordStatusList = statusService.getAllowedStatus(record);
        return recordStatusList.stream().map(statusDisplayDtoMapper::getStatusDisplayDto).collect(Collectors.toList());
    }

    @GetMapping("/records")
    public List<String> getRecordTypes() {
        return Arrays.stream(Record.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }

}
