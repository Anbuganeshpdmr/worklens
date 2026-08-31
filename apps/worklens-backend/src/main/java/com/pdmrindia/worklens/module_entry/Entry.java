package com.pdmrindia.worklens.module_entry;

import com.pdmrindia.worklens.module_activity.Activity;
import com.pdmrindia.worklens.module_activity_type.ActivityType;
import com.pdmrindia.worklens.module_sprint_activity.SprintActivity;
import com.pdmrindia.worklens.module_status.Status;
import com.pdmrindia.worklens.module_user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Duration;
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
    @JoinColumn(name = "sprint_activity_id")
    private SprintActivity sprintActivity;

    @ManyToOne
    @JoinColumn(name = "status_id",nullable = false)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "activity_id")
    private Activity activity;

    private String name;

    private String description;

    private Integer externalTicketId;

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private User user;

    private LocalDate activityDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Duration duration;
    private String remarks;

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
