package com.pdmrindia.worklens.module_record_status;

import com.pdmrindia.worklens.module_record.Record;
import com.pdmrindia.worklens.module_status.Status;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(
        name = "record_statuses",
        uniqueConstraints = @UniqueConstraint(columnNames = {
                "record_name",
                "status_id"
        }))
public class RecordStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "record_name", nullable = false, length = 25)
    private Record record;

    @ManyToOne
    @JoinColumn(name = "status_id", nullable = false)
    private Status status;

    private boolean isAllowed;

    private boolean isDefault;

}
