package com.pdmrindia.worklens.module_sprint;

import com.pdmrindia.worklens.module_status.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SprintRepo extends JpaRepository<Sprint,Integer> {

    List<Sprint> findByStatus(Status status);
}
