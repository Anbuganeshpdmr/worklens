package com.pdmrindia.worklens.module_sprint_activity;

import com.pdmrindia.worklens.module_activity.Activity;
import com.pdmrindia.worklens.module_entry.Entry;
import com.pdmrindia.worklens.module_sprint.Sprint;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(
        name = "sprint_activities",
        uniqueConstraints = @UniqueConstraint(columnNames = {
                "sprint_id",
                "activity_id"
        })
)
public class SprintActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "sprint_id", nullable = false)
    private Sprint sprint;

    @ManyToOne
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    @OneToMany(mappedBy = "sprintActivity")
    private List<Entry> entries = new ArrayList<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SprintActivity)) return false;
        SprintActivity other = (SprintActivity) o;
        return id != null && id.equals(other.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "SprintActivity{id=" + id + '}';
    }
}
