package com.pdmrindia.worklens.module_activity;

import com.pdmrindia.worklens.module_activity_type.ActivityType;
import com.pdmrindia.worklens.module_category.Category;
import com.pdmrindia.worklens.module_project.Project;
import com.pdmrindia.worklens.module_sprint_activity.SprintActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepo extends JpaRepository<Activity, Integer> {

    List<Activity> findByProject(Project project);

    List<Activity> findByActivityType(ActivityType activityType);

    List<Activity> findByActivityType_Category(Category category);

    List<Activity> findByParentActivity(Activity activity);
}
