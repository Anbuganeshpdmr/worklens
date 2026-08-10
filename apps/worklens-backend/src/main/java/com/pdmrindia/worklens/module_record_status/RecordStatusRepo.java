package com.pdmrindia.worklens.module_record_status;

import com.pdmrindia.worklens.module_record.Record;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface RecordStatusRepo extends JpaRepository<RecordStatus,Integer> {

    List<RecordStatus> findByRecord(Record record);
}
