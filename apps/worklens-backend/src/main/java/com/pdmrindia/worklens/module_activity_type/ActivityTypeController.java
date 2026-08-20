package com.pdmrindia.worklens.module_activity_type;

import com.pdmrindia.worklens.module_status.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class ActivityTypeController {

    private final ActivityTypeService activityTypeService;
    private final ActivityTypeRepo activityTypeRepo;

    @PostMapping("/type")
    public ActivityType addNewType(@RequestBody ActivityType activityType){
        return activityTypeService.createType(activityType);
    }

    @PutMapping("type/{id}")
    public ActivityType editType(@PathVariable("id") int id, @RequestBody ActivityType activityType){
        return activityTypeService.updateType(id,activityType);
    }

    @GetMapping("type/all")
    public List<ActivityType> getAllTypes(){
        return activityTypeRepo.findAll();
    }
}
