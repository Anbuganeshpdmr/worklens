package com.pdmrindia.worklens.module_activity_type;

import com.pdmrindia.worklens.exception.ActivityTypeException;
import com.pdmrindia.worklens.module_activity_type.mapperDtos.NewTypeDto;
import com.pdmrindia.worklens.module_activity_type.mapperDtos.UpdateTypeDto;
import com.pdmrindia.worklens.module_category.Category;
import com.pdmrindia.worklens.module_category.CategoryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityTypeService {

    private final ActivityTypeRepo activityTypeRepo;
    private final CategoryService categoryService;

    public void createMandatoryType(List<NewTypeDto> newTypeDtoList){
        for(NewTypeDto newTypeDto: newTypeDtoList){
            ActivityType activityType = new ActivityType();

            Category category = getCategory(newTypeDto.getCategoryId());
            activityType.setCategory(category);
            activityType.setName(newTypeDto.getName());
            activityType.setColourCode(newTypeDto.getColourCode());
            activityType.setMandatory(true);

            if(activityTypeRepo.findByNameAndCategory(newTypeDto.getName(),category).isPresent()){
                continue;
            }
            activityTypeRepo.save(activityType);
        }
    }

    public ActivityType createOptionalType(NewTypeDto newTypeDto){
        ActivityType activityType = new ActivityType();

        Category category = getCategory(newTypeDto.getCategoryId());
        activityType.setCategory(category);
        activityType.setName(newTypeDto.getName());
        activityType.setColourCode(newTypeDto.getColourCode());
        activityType.setMandatory(false);
        return activityTypeRepo.save(activityType);
    }

    private Category getCategory(Object categoryId){
        if(categoryId instanceof Integer intId){
            return categoryService.getCategoryById(intId);
        }else if (categoryId instanceof String name){
            return categoryService.getCategoryByName(name);
        }else if (categoryId == null) {
            throw new IllegalArgumentException("Category ID cannot be null");
        } else {
            throw new IllegalArgumentException("Unsupported ID type: " + categoryId.getClass().getName());
        }
    }

    public ActivityType updateType(UpdateTypeDto updatedType){
        ActivityType activityType = getTypeById(updatedType.getTypeId());
        activityType.setColourCode(updatedType.getColourCode());
        if(!activityType.isMandatory()){
            activityType.setName(updatedType.getName());
        }
        return activityTypeRepo.save(activityType);
    }

    public ActivityType getTypeById(int typeId){
        return activityTypeRepo.findById(typeId).orElseThrow(()->new ActivityTypeException.NoSuchTypeException("No Such Activity Type"));
    }

    public ActivityType getTypeByName(String name){
        return activityTypeRepo.findByName(name).orElseThrow(()->new ActivityTypeException.NoSuchTypeException("No Such Activity Type"));
    }

    public List<ActivityType> getTypesByCategory(int categoryId){
        return activityTypeRepo.findByCategory(getCategory(categoryId));
    }
}
