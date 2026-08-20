package com.pdmrindia.worklens.module_activity_type;

import com.pdmrindia.worklens.exception.ActivityTypeException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivityTypeService {

    private final ActivityTypeRepo activityTypeRepo;

    public ActivityType createType(ActivityType activityType){
        return activityTypeRepo.save(activityType);
    }


    public ActivityType updateType(int typeId, ActivityType updatedType){
        ActivityType activityType = getTypeById(typeId);
        activityType.setName(updatedType.getName());
        activityType.setColourCode(updatedType.getColourCode());
        return activityTypeRepo.save(activityType);
    }

    public ActivityType getTypeById(int typeId){
        return activityTypeRepo.findById(typeId).orElseThrow(()->new ActivityTypeException.NoSuchTypeException("No Such Activity Type"));
    }

    public ActivityType getTypeByName(String name){
        return activityTypeRepo.findByName(name).orElseThrow(()->new ActivityTypeException.NoSuchTypeException("No Such Activity Type"));
    }
}
