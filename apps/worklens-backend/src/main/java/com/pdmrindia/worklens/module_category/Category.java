package com.pdmrindia.worklens.module_category;

import com.pdmrindia.worklens.module_activity_type.ActivityType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

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

    @OneToMany(mappedBy = "category")
    private List<ActivityType> activityTypeList = new ArrayList<>();

    private boolean isMandatory;

}
