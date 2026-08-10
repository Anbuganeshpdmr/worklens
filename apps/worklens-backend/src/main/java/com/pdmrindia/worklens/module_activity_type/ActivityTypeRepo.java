package com.pdmrindia.worklens.module_activity_type;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityTypeRepo extends JpaRepository<ActivityType, Integer> {

}
