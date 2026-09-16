package com.pdmrindia.worklens.module_project;

import com.pdmrindia.worklens.module_status.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepo extends JpaRepository<Project,Integer> {

    List<Project> findByStatus(Status status);
}
