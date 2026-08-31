package com.pdmrindia.worklens.module_status;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StatusRepo extends JpaRepository<Status, Integer> {

    Optional<Status> findByRecordAndDisplayName(Record record, String name);

    Optional<Status> findByRecordAndDisplayNameAndIsMandatory(Record record, String name, boolean isMandatory);

    List<Status> findByRecordAndIsApplicable(Record record, boolean isApplicable);

    List<Status> findByRecord(Record record);
}
