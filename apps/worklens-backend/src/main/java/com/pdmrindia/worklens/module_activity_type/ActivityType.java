package com.pdmrindia.worklens.module_activity_type;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "activity_types", uniqueConstraints = {
        @UniqueConstraint(name = "uk_activity_type_name", columnNames = "name"),
        @UniqueConstraint(name = "uk_activity_type_colour_code", columnNames = "colour_code"),
})
public class ActivityType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false,unique = true)
    private String name;

    @Column(name = "colour_code", nullable = false,unique = true)
    private String colourCode;

    private boolean isMandatory;

    @Column(nullable = false)
    private boolean general = false;
}
