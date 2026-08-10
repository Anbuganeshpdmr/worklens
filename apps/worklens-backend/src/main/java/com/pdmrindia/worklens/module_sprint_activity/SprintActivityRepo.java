package com.pdmrindia.worklens.module_sprint_activity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SprintActivityRepo extends JpaRepository<SprintActivity, Integer> {
}
