package com.pdmrindia.worklens.module_category;

import com.pdmrindia.worklens.exception.CategoryException;
import com.pdmrindia.worklens.module_category.mapperDtos.NewCategoryDto;
import com.pdmrindia.worklens.module_category.mapperDtos.UpdateCategoryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepo categoryRepo;

    public void createMandatoryCategory(List<NewCategoryDto> newCategoryDtoList){
        for(NewCategoryDto newCategoryDto: newCategoryDtoList){
            Category category = new Category();
            category.setMandatory(true);
            category.setName(newCategoryDto.getName());
            category.setColourCode(newCategoryDto.getColourCode());
            if(categoryRepo.findByNameAndIsMandatory(newCategoryDto.getName(),true).isPresent()){
                continue;
            }
            categoryRepo.save(category);
        }
    }

    public Category createOptionalCategory(NewCategoryDto newCategoryDto){
        Category category = new Category();
        category.setMandatory(false);
        category.setName(newCategoryDto.getName());
        category.setColourCode(newCategoryDto.getColourCode());
        return categoryRepo.save(category);
    }

    public Category getCategoryById(int id){
        return categoryRepo.findById(id)
                .orElseThrow(()->new CategoryException.NoSuchCategoryException("No Category found for this Id: "+id));
    }

    public Category getCategoryByName(String name){
        return categoryRepo.findByName(name)
                .orElseThrow(()->new CategoryException.NoSuchCategoryException("No Category found for this name: "+name));
    }

    public Category updateCategory(UpdateCategoryDto updateCategoryDto){
        Category category = getCategoryById(updateCategoryDto.getCategoryId());
        category.setColourCode(updateCategoryDto.getColourCode());
        if(!category.isMandatory()){
            category.setName(updateCategoryDto.getName());
        }
        return categoryRepo.save(category);
    }
}
