package com.pdmrindia.worklens.module_record_status;

import com.pdmrindia.worklens.module_record.Record;
import com.pdmrindia.worklens.module_record_status.mapperDtos.RecordStatusDisplayDto;
import com.pdmrindia.worklens.module_record_status.mapperDtos.RecordStatusDisplayDtoMapper;
import com.pdmrindia.worklens.module_record_status.mapperDtos.RecordStatusInputDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Arrays;
import java.util.stream.Collectors;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class RecordStatusController {

    private final RecordStatusService recordStatusService;
    private final RecordStatusDisplayDtoMapper recordStatusDisplayDtoMapper;

    @GetMapping("/records-types")
    public List<String> getRecordTypes() {
        return Arrays.stream(Record.values())
                     .map(Enum::name)
                     .collect(Collectors.toList());
    }

    @GetMapping("/records/{recordName}")
    public List<RecordStatusDisplayDto> getRecordStatus(@PathVariable("recordName") String recordName){
        Record record = Record.valueOf(recordName.toUpperCase());
        List<RecordStatus> recordStatusList = recordStatusService.getRecordStatusesByRecord(record);
        return recordStatusList.stream().map(recordStatusDisplayDtoMapper::getRecordStatusDisplayDto).collect(Collectors.toList());
    }

    // validate All and correct 'RecordStatus' objects-IDs are loaded from client
    @PutMapping("/records/{recordName}")
    public List<RecordStatusDisplayDto> processRecordStatuses(@PathVariable("recordName") String recordName,
                                                              @RequestBody List<RecordStatusInputDto> recordStatusInputDtoList){
        Record record = Record.valueOf(recordName.toUpperCase());
        List<RecordStatus> updatedRecordStatusList = recordStatusService.editRecordStatuses(recordStatusInputDtoList);
        return updatedRecordStatusList.stream().map(recordStatusDisplayDtoMapper::getRecordStatusDisplayDto).collect(Collectors.toList());
    }

    //  List of All Allowed status (RS)
    @GetMapping("records/{recordName}/allowed")
    public List<RecordStatusDisplayDto> getAllowedRecordStatus(@PathVariable("recordName") String recordName){
        Record record = Record.valueOf(recordName.toUpperCase());
        return recordStatusService.getAllowedRecordStatuses(record);
    }

    //  Default status

}
