package com.pdmrindia.worklens.module_record;

import com.pdmrindia.worklens.exception.RecordStatusException;
import com.pdmrindia.worklens.module_record_status.RecordStatus;
import com.pdmrindia.worklens.module_status.Status;
import com.pdmrindia.worklens.module_record_status.RecordStatusRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecordService {

    private final RecordStatusRepo recordStatusRepo;

    public Status getDefaultStatus(Record record){
        List<RecordStatus> recordStatusList = recordStatusRepo.findByRecord(record);
        RecordStatus rs = recordStatusList.stream()
                .filter(RecordStatus::isDefault)
                .findFirst()
                .orElseThrow(()->new RecordStatusException.NoDefaultStatusException("No default status available"));
        return rs.getStatus();
    }

    public List<Status> getAllowedRecordStatuses(Record record){
        return recordStatusRepo.findByRecord(record)
                .stream()
                .filter(RecordStatus::isAllowed)
                .map(RecordStatus::getStatus)
                .toList();
    }

}
