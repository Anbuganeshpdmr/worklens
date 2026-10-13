package com.pdmrindia.worklens.module_entry;

import com.pdmrindia.worklens.module_sprint_activity.SprintActivity;
import com.pdmrindia.worklens.module_status.Status;
import com.pdmrindia.worklens.module_user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EntryRepo extends JpaRepository<Entry, Long>,
        JpaSpecificationExecutor<Entry> {

    List<Entry> findByUserAndStatus(User user, Status status);

    List<Entry> findBySprintActivityAndStatus(SprintActivity sprintActivity, Status status);

    List<Entry> findByUserAndEndDateTimeIsNull(User user);

    @Query(value = """
        SELECT e.id
        FROM entries e
        WHERE e.creator_id = :userId
          AND e.id <> :entryId
          AND e.start_date_time < COALESCE(:newEndDateTime, NOW())
          AND COALESCE(e.end_date_time, NOW()) > :newStartDateTime
        """, nativeQuery = true)
    List<Integer> findOverlappingEntries(
            @Param("userId") Long userId,
            @Param("entryId") Long entryId,
            @Param("newStartDateTime") LocalDateTime newStartDateTime,
            @Param("newEndDateTime") LocalDateTime newEndDateTime
    );
}
