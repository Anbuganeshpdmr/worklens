package com.pdmrindia.worklens.module_record_status;

import com.pdmrindia.worklens.exception.RecordStatusException;
import com.pdmrindia.worklens.module_record.Record;
import com.pdmrindia.worklens.module_record_status.mapperDtos.RecordStatusDisplayDto;
import com.pdmrindia.worklens.module_record_status.mapperDtos.RecordStatusDisplayDtoMapper;
import com.pdmrindia.worklens.module_record_status.mapperDtos.RecordStatusInputDto;
import com.pdmrindia.worklens.module_status.Status;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecordStatusService {

    private final RecordStatusRepo recordStatusRepo;
    private final RecordStatusDisplayDtoMapper recordStatusDisplayDtoMapper;

    @Transactional
    public void addRecordStatusForNewStatus(Status status){
        for(Record record: Record.values()){
            RecordStatus rs = new RecordStatus();
            rs.setRecord(record);
            rs.setStatus(status);
            rs.setAllowed(false);
            rs.setDefault(false);

            recordStatusRepo.save(rs);
        }
    }

    public List<RecordStatus> getRecordStatusesByRecord(Record record){
        return recordStatusRepo.findByRecord(record);
    }

    public List<RecordStatus> editRecordStatuses(List<RecordStatusInputDto> recordStatusInputDtoList){

        checkDefaultStatus(new ArrayList<>(recordStatusInputDtoList));

        List<Integer> idList = List.copyOf(recordStatusInputDtoList).stream().map(RecordStatusInputDto::getId).toList();
        List<RecordStatus> recordStatusList = recordStatusRepo.findAllById(idList);
        List<RecordStatus> updatedRecordStatusList = new ArrayList<>();

        Map<Integer, RecordStatus> recordStatusMap = recordStatusList.stream().collect(Collectors.toMap(
                RecordStatus::getId, Function.identity()
        ));

        for(RecordStatusInputDto dto: recordStatusInputDtoList){
            RecordStatus recordStatus = recordStatusMap.get(dto.getId());
            recordStatus.setAllowed(dto.isAllowed());
            recordStatus.setDefault(dto.isDefault());
            updatedRecordStatusList.add(recordStatus);
        }

        return recordStatusRepo.saveAll(updatedRecordStatusList);
    }

    public void checkDefaultStatus(List<RecordStatusInputDto> recordStatusInputDtoList){
        List<RecordStatusInputDto> filteredDefaultRecordStatusList = recordStatusInputDtoList
                .stream()
                .filter(RecordStatusInputDto::isDefault).toList();

        if(filteredDefaultRecordStatusList.size() != 1){
            System.out.println("Size is: "+filteredDefaultRecordStatusList.size());
            throw new RecordStatusException.DefaultStatusException("One Default Status should be selected");
        }
        if(!filteredDefaultRecordStatusList.get(0).isAllowed()){
            throw new RecordStatusException.DefaultStatusNotAllowedException("Default Status should be allowed");
        }
    }

    public RecordStatus getDefaultRecordStatus(Record record){
        List<RecordStatus> recordStatusList = recordStatusRepo.findByRecord(record);
        return  recordStatusList.stream()
                .filter(RecordStatus::isDefault)
                .findFirst()
                .orElseThrow(()->new RecordStatusException.NoDefaultStatusException("No default status available"));

    }

    public List<RecordStatusDisplayDto> getAllowedRecordStatuses(Record record){
        return recordStatusRepo.findByRecord(record)
                .stream()
                .filter(RecordStatus::isAllowed)
                .map(recordStatusDisplayDtoMapper::getRecordStatusDisplayDto)
                .toList();
    }

    public RecordStatus getRecordStatusById(int id){
        return recordStatusRepo.findById(id)
                .orElseThrow(()->new RecordStatusException.NoSuchRecordStatusException("No valid record status found"));
    }

    public void validateRecordStatusOfRecord(Record record, RecordStatus recordStatus){
        if(recordStatus.getRecord()!=record){
            throw new RecordStatusException.RecordStatusMismatchException("Record Mismatch");
        }
        if(!recordStatus.isAllowed()){
            throw new RecordStatusException.RecordStatusNotAllowedException("Status Not Allowed");
        }
    }

    public RecordStatus getByRecordAndStatus(Record record, Status status){
        return recordStatusRepo.findByRecordAndStatus(record, status)
                .orElseThrow(()->new RecordStatusException.NoSuchRecordStatusException("No valid record status found"));
    }


}
