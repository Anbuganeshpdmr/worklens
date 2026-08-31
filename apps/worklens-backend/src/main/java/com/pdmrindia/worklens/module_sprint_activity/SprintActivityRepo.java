package com.pdmrindia.worklens.module_sprint_activity;

import com.pdmrindia.worklens.module_activity.Activity;
import com.pdmrindia.worklens.module_activity_type.ActivityType;
import com.pdmrindia.worklens.module_sprint.Sprint;
import com.pdmrindia.worklens.module_status.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SprintActivityRepo extends JpaRepository<SprintActivity, Integer> {

    List<SprintActivity> findBySprint(Sprint sprint);

    List<SprintActivity> findBySprintAndActivityIn(Sprint sprint, List<Activity> activityList);

    List<SprintActivity> findBySprintAndIsAllowed(Sprint sprint, boolean isAllowed);

    /*@Query("""
    SELECT COUNT(sa)
    FROM SprintActivity sa
    WHERE sa.sprint = :sprint
      AND sa.activity.activityType = :activityType
    """)
    long countBySprintAndActivityType(
            @Param("sprint") Sprint sprint,
            @Param("activityType") ActivityType activityType
    );*/
    //long countBySprintAndActivity_ActivityType(Sprint sprint,ActivityType activityType);

    long countBySprintAndStatus(Sprint sprint, Status status);
}
