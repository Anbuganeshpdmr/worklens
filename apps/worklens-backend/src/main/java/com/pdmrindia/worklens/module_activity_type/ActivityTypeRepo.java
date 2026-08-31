package com.pdmrindia.worklens.module_activity_type;

import com.pdmrindia.worklens.module_category.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityTypeRepo extends JpaRepository<ActivityType, Integer> {

    Optional<ActivityType> findByName(String name);

    Optional<ActivityType> findByNameAndCategory(String name, Category category);

    List<ActivityType> findByCategory(Category category);
}
