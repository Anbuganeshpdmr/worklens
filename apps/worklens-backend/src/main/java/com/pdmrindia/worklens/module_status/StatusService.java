package com.pdmrindia.worklens.module_status;

import com.pdmrindia.worklens.exception.StatusException;
import com.pdmrindia.worklens.module_record_status.RecordStatusService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StatusService {

    private final StatusRepo statusRepo;
    private final RecordStatusService recordStatusService;

    @Transactional
    public Status createStatus(Status status){

        status =  statusRepo.save(status);
        recordStatusService.addRecordStatusForNewStatus(status);
        return status;
    }

    @Transactional
    public Status updateStatus(int statusId, Status modifiedStatus){
        Status status = getStatusById(statusId);
        status.setName(modifiedStatus.getName());
        status.setColourCode(modifiedStatus.getColourCode());
        status = statusRepo.save(status);
        return status;
    }

    public Status getStatusById(int statusId){
        return statusRepo.findById(statusId).orElseThrow(()->new StatusException.NoSuchStatusException("No Matching Status found"));
    }

    public Status getStatusByName(String name){
        return statusRepo.findByName(name).orElseThrow(()->new StatusException.NoSuchStatusException("No Matching Status found"));
    }

}
