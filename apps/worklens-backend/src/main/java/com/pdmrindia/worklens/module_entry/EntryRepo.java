package com.pdmrindia.worklens.module_entry;

import com.pdmrindia.worklens.module_status.Status;
import com.pdmrindia.worklens.module_user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntryRepo extends JpaRepository<Entry, Long>,
        JpaSpecificationExecutor<Entry> {

    List<Entry> findByUserAndStatus(User user, Status status);
}
