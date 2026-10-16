package com.pdmrindia.worklens.module_category;

import com.pdmrindia.worklens.exception.CategoryException;
import com.pdmrindia.worklens.module_category.mapperDtos.NewCategoryDto;
import com.pdmrindia.worklens.module_category.mapperDtos.UpdateCategoryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public void setWorkCategory(Integer categoryId) {

        categoryRepo.findByWorkTrue()
                .ifPresent(category -> {
                    category.setWork(false);
                    categoryRepo.save(category);
                });

        Category newCategory = getCategoryById(categoryId);

        newCategory.setWork(true);
        categoryRepo.save(newCategory);
    }

    public Category getWorkCategory(){
        return categoryRepo.findByWorkTrue()
                .orElseThrow(()->new CategoryException.NoSuchCategoryException("No Work Category set"));
    }

    public List<Category> getCommonCategories(){
        return categoryRepo.findByWorkFalse();
    }
}
