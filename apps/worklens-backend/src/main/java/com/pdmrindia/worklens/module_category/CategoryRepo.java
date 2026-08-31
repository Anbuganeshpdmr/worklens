package com.pdmrindia.worklens.module_category;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepo extends JpaRepository<Category,Integer> {


    Optional<Category> findByName(String name);

    Optional<Category> findByNameAndIsMandatory(String name, boolean isMandatory);
}
