package com.pdmrindia.worklens.module_activity_type;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityTypeRepo extends JpaRepository<ActivityType, Integer> {

    Optional<ActivityType> findByName(String name);

    Optional<ActivityType> findByNameAndIsMandatory(String name, boolean isMandatory);

    Optional<ActivityType> findByGeneralTrue();

    List<ActivityType> findByGeneralFalse();
}
