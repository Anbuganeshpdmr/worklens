package com.pdmrindia.worklens.module_category.mapperDtos;

import com.pdmrindia.worklens.module_category.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryDisplayDtoMapper {

    public CategoryDisplayDto getCategoryDisplayDto(Category category){
        CategoryDisplayDto dto = new CategoryDisplayDto();
        dto.setId(category.getId());
        dto.setMandatory(category.isMandatory());
        dto.setName(category.getName());
        dto.setColourCode(category.getColourCode());
        return dto;
    }

    public SimpleCategoryDispDto getSimpleCategoryDispDto(Category category){
        SimpleCategoryDispDto dto = new SimpleCategoryDispDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setColourCode(category.getColourCode());
        return dto;
    }
}
