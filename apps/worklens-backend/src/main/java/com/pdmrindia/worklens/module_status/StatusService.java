package com.pdmrindia.worklens.module_status;

import com.pdmrindia.worklens.exception.RecordStatusException;
import com.pdmrindia.worklens.exception.StatusException;
import com.pdmrindia.worklens.module_status.mapperDtos.NewStatusDto;
import com.pdmrindia.worklens.module_status.mapperDtos.UpdateRecordStatusesDto;
import com.pdmrindia.worklens.module_status.mapperDtos.UpdateStatusMetaDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatusService {

    private final StatusRepo statusRepo;

    @Transactional
    public Status createOptionalStatus(NewStatusDto newStatusDto){

        Status status = new Status();
        status.setColourCode(newStatusDto.getColourCode());
        status.setDisplayName(newStatusDto.getDisplayName().toLowerCase());
        status.setMandatory(false);

        Record record = Record.valueOf(newStatusDto.getRecordName().trim().toUpperCase());
        status.setRecord(record);

        //checkAndSetDefaultStatus(record,status);

        status =  statusRepo.save(status);
        return status;
    }

    @Transactional
    public void createMandatoryStatus(List<NewStatusDto> newStatusDtoList){

        for(NewStatusDto newStatusDto: newStatusDtoList){

            Status status = new Status();
            status.setColourCode(newStatusDto.getColourCode());
            status.setDisplayName(newStatusDto.getDisplayName().toLowerCase());
            status.setMandatory(true);
            status.setApplicable(true);

            Record record = Record.valueOf(newStatusDto.getRecordName().trim().toUpperCase());
            status.setRecord(record);

            if(statusRepo.findByRecordAndDisplayNameAndIsMandatory(
                record,newStatusDto.getDisplayName().toLowerCase(),true
            ).isPresent()){
                continue;
            }
            statusRepo.save(status);
        }
    }

    public Status getStatusById(int statusId){
        return statusRepo.findById(statusId).orElseThrow(()->new StatusException.NoSuchStatusException("No Matching Status found"));
    }

    public Status getRecordStatusByName(Record record, String name){
        return statusRepo.findByRecordAndDisplayName(record,name)
                .orElseThrow(()->new StatusException.NoSuchStatusException("No Matching Status found for Record: "+record.name()+" And Status: "+name));
    }

    @Transactional
    public Status updateStatusMeta(UpdateStatusMetaDto dto){
        Status status = getStatusById(dto.getStatusId());
        status.setColourCode(dto.getColourCode());

        if(!status.isMandatory()){
            status.setDisplayName(dto.getDisplayName());
        }
        status = statusRepo.save(status);
        return status;
    }

    @Transactional
    public List<Status> updateRecordStatuses(UpdateRecordStatusesDto dto){

        if (dto.getApplicableStatusIds() == null) {
            throw new IllegalArgumentException(
                    "Applicable statuses cannot be null"
            );
        }
        return updateApplicableStatusForRecords(dto);

    }

    private List<Status> updateApplicableStatusForRecords(UpdateRecordStatusesDto dto) {
        Record record = Record.valueOf(dto.getRecordName().trim().toUpperCase());

        List<Status> statusList = statusRepo.findByRecord(record);

        Set<Integer> statusIdSetFromRepo = statusList.stream()
                .map(Status::getId)
                .collect(Collectors.toSet());

        if (!statusIdSetFromRepo.containsAll(dto.getApplicableStatusIds())) {
            throw new StatusException.RecordStatusCountMismatchException("Provided status IDs do not match the record configuration");
        }

        for (Status status : statusList) {
            if (status.isMandatory() || dto.getApplicableStatusIds().contains(status.getId())) {
                status.setApplicable(true);
            } else {
                status.setApplicable(false);
            }
        }

        return statusRepo.saveAll(statusList);
    }


    /*public void validateRecordOfStatus(Record record, Status status){
        if(status.getRecord()!=record){
            throw new StatusException.RecordStatusMismatchException("Record And Status Mismatch");
        }
    }*/

    public List<Status> getAllowedStatus(Record record){
        return statusRepo.findByRecordAndIsApplicable(record,true);
    }

    /*
    Checks Status has applicable Record
    Checks RecordStatus is allowed
     */
    public void validateRecordStatusOfRecord(Record record, Status status){
        if(status.getRecord()!=record){
            throw new RecordStatusException.RecordStatusMismatchException("Record Mismatch");
        }
        if(!status.isApplicable()){
            throw new RecordStatusException.RecordStatusNotAllowedException("Status Not Allowed");
        }
    }

}
