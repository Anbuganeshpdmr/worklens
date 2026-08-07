package com.pdmrindia.worklens.module_record;

import com.pdmrindia.worklens.module_record.Record;
import com.pdmrindia.worklens.module_record_status.RecordStatus;
import com.pdmrindia.worklens.module_sprint.Status;
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
        RecordStatus rs = recordStatusList.stream().filter(RecordStatus::isDefault).findFirst().orElseThrow(()->new RuntimeException("g"));
        return rs.getStatus();
    }
}
