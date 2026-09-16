package com.pdmrindia.worklens.module_resource;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResourceRepo extends JpaRepository<Resource, Integer> {

    Optional<Resource> findByUniqueFileName(String uniqueFileName);
}
