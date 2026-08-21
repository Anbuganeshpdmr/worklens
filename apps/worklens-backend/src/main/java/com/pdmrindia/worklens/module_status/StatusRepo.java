package com.pdmrindia.worklens.module_status;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StatusRepo extends JpaRepository<Status, Integer> {

    Optional<Status> findByName(String name);
}
