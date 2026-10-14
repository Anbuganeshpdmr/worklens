package com.pdmrindia.worklens.module_category;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Entity
@Table(name = "categories",uniqueConstraints = {
        @UniqueConstraint(name = "uk_category_name", columnNames = "name"),
        @UniqueConstraint(name = "uk_category_colour_code", columnNames = "colour_code")
})
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "colour_code", nullable = false, unique = true)
    private String colourCode;

    private boolean isMandatory;

    @Column(nullable = false)
    private boolean work = false;

}
