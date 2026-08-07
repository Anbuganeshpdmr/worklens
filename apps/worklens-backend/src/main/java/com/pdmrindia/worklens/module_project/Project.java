package com.pdmrindia.worklens.module_project;

import com.pdmrindia.worklens.module_activity.Activity;
import com.pdmrindia.worklens.module_sprint.Sprint;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "project")
    private List<Sprint> sprints = new ArrayList<>();

    @OneToMany(mappedBy = "project")
    private List<Activity> activities = new ArrayList<>();

    private boolean isActive;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Project)) return false;
        Project other = (Project) o;
        return id != null && id.equals(other.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Project{id=" + id + '}';
    }
}
