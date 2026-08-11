package com.pdmrindia.worklens.module_sprint;

import com.pdmrindia.worklens.module_record_status.RecordStatus;
import com.pdmrindia.worklens.module_sprint_activity.SprintActivity;
import com.pdmrindia.worklens.module_project.Project;
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
@Table(name = "sprints")
public class Sprint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @OneToMany(mappedBy = "sprint")
    private List<SprintActivity> sprintActivities = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "record_status_id", nullable = false)
    private RecordStatus recordStatus;

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
