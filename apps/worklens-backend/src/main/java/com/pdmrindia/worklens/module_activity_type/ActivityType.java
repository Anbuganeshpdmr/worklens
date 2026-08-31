package com.pdmrindia.worklens.module_activity_type;

import com.pdmrindia.worklens.module_category.Category;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "activity_types", uniqueConstraints = {
        @UniqueConstraint(name = "uk_activity_type_name", columnNames = "name"),
        @UniqueConstraint(name = "uk_activity_type_colour_code", columnNames = "colour_code"),
        @UniqueConstraint(name = "uk_category_activity",columnNames = {
                "name","category_id"
        })
})
public class ActivityType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false,unique = true)
    private String name;

    @Column(name = "colour_code", nullable = false,unique = true)
    private String colourCode;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    private boolean isMandatory;
}
