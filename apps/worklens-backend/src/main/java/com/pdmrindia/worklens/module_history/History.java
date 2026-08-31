package com.pdmrindia.worklens.module_history;

import com.pdmrindia.worklens.module_status.Record;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "histories")
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Record record;

    private Long dataId;
}
