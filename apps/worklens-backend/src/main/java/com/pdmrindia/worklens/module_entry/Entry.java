package com.pdmrindia.worklens.module_entry;

import com.pdmrindia.worklens.module_activity.ActivityType;
import com.pdmrindia.worklens.module_sprint_activity.SprintActivity;
import com.pdmrindia.worklens.module_user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Entity
@Table(name = "entries")
public class Entry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sprint_activity_id", nullable = false)
    private SprintActivity sprintActivity;

    private String name;
    private String description;
    private ActivityType activityType;
    private String openProjectTicketId;

    private User user;
    private LocalDate activityDate;
    private LocalTime startTime;
    private LocalTime endTime;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Entry)) return false;
        Entry other = (Entry) o;
        return id != null && id.equals(other.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Entry{id=" + id + '}';
    }
}
