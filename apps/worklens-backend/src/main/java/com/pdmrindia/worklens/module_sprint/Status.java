package com.pdmrindia.worklens.module_sprint;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "statuses")
public class Status {

    //id
    //display_name
    //colour_code
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String colourCode;


}
