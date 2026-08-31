package com.pdmrindia.worklens.module_status;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "statuses",uniqueConstraints = {
        @UniqueConstraint(name = "uk_status_colour", columnNames = "colour_code"),
        @UniqueConstraint(
        name = "uk_status_record_display_name",
        columnNames = {"record_name", "display_name"}
)
})
public class Status {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Enumerated(EnumType.STRING)
    @Column(name = "record_name", nullable = false, length = 25)
    private Record record;

    @Column(name = "colour_code", unique = true, nullable = false)
    private String colourCode;

    @Transient
    public String getUniqueName() {
        return record.name().toUpperCase() + "_" + displayName;
    }

    private boolean isMandatory;

    private boolean isApplicable;
}
