package com.pdmrindia.worklens.module_sprint;

import com.pdmrindia.worklens.module_sprint_activity.SprintActivity;
import com.pdmrindia.worklens.module_project.Project;
import com.pdmrindia.worklens.module_status.Status;
import com.pdmrindia.worklens.module_user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "sprints",uniqueConstraints = {
        @UniqueConstraint(
                name = "uk_project_sprint_name",
                columnNames = {"project_id", "sprint_name"}
        )
})
public class Sprint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "sprint_name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @OneToMany(mappedBy = "sprint")
    private List<SprintActivity> sprintActivities = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "status_id",nullable = false)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private User createdBy;

    private Instant createdOn;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Sprint)) return false;
        Sprint other = (Sprint) o;
        return id != null && id.equals(other.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Sprint{id=" + id + '}';
    }
}
