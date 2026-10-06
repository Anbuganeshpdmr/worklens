package com.pdmrindia.worklens.module_category;

import com.pdmrindia.worklens.config.Permissions;
import com.pdmrindia.worklens.module_category.mapperDtos.CategoryDisplayDto;
import com.pdmrindia.worklens.module_category.mapperDtos.CategoryDisplayDtoMapper;
import com.pdmrindia.worklens.module_category.mapperDtos.NewCategoryDto;
import com.pdmrindia.worklens.module_category.mapperDtos.UpdateCategoryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final CategoryDisplayDtoMapper categoryDisplayDtoMapper;
    private final CategoryRepo categoryRepo;

    @PreAuthorize(Permissions.FHTL)
    @PostMapping("/category")
    public CategoryDisplayDto addNewOptionalCategory(@RequestBody NewCategoryDto newCategoryDto){
        Category category = categoryService.createOptionalCategory(newCategoryDto);
        return categoryDisplayDtoMapper.getCategoryDisplayDto(category);
    }

    @PreAuthorize(Permissions.FHTL)
    @PutMapping("/category")
    public CategoryDisplayDto editCategory(@RequestBody UpdateCategoryDto updateCategoryDto){
        Category category = categoryService.updateCategory(updateCategoryDto);
        return categoryDisplayDtoMapper.getCategoryDisplayDto(category);
    }

    @PreAuthorize(Permissions.FHTLUSER)
    @GetMapping("/category")
    public List<CategoryDisplayDto> getAllCategories(){
        return categoryRepo.findAll().stream().map(categoryDisplayDtoMapper::getCategoryDisplayDto).toList();
    }

    @PreAuthorize(Permissions.FHTLUSER)
    @GetMapping("/category/non-test")
    public List<CategoryDisplayDto> getNonTestCategories(){
        return categoryRepo.findAll().stream()
                .filter(c->(!c.getName().toLowerCase().contains("sprint-testing")))
                .map(categoryDisplayDtoMapper::getCategoryDisplayDto).toList();
    }

    @PreAuthorize(Permissions.FHTLUSER)
    @GetMapping("/category/{id}")
    public CategoryDisplayDto getCategory(@PathVariable("id") int id){
        return categoryDisplayDtoMapper.getCategoryDisplayDto(categoryService.getCategoryById(id));
    }
}
