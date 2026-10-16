package com.pdmrindia.worklens.module_activity_type;

import com.pdmrindia.worklens.config.Permissions;
import com.pdmrindia.worklens.module_activity_type.mapperDtos.NewTypeDto;
import com.pdmrindia.worklens.module_activity_type.mapperDtos.TypeDisplayDto;
import com.pdmrindia.worklens.module_activity_type.mapperDtos.TypeDisplayDtoMapper;
import com.pdmrindia.worklens.module_activity_type.mapperDtos.UpdateTypeDto;
import com.pdmrindia.worklens.module_category.Category;
import com.pdmrindia.worklens.module_category.CategoryService;
import com.pdmrindia.worklens.module_status.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class ActivityTypeController {

    private final ActivityTypeService activityTypeService;
    private final ActivityTypeRepo activityTypeRepo;
    private final TypeDisplayDtoMapper typeDisplayDtoMapper;

    @PreAuthorize(Permissions.FHTL)
    @PostMapping("/type")
    public TypeDisplayDto addNewOptionalType(@RequestBody NewTypeDto newTypeDto){
        ActivityType type = activityTypeService.createOptionalType(newTypeDto);
        return typeDisplayDtoMapper.getTypeDisplayDto(type);
    }

    @PreAuthorize(Permissions.FHTL)
    @PutMapping("/type")
    public TypeDisplayDto editType(@RequestBody UpdateTypeDto updateTypeDto){
        ActivityType type = activityTypeService.updateType(updateTypeDto);
        return typeDisplayDtoMapper.getTypeDisplayDto(type);
    }

    @PreAuthorize(Permissions.FHTLUSER)
    @GetMapping("/type")
    public List<TypeDisplayDto> getAllTypes(){
        return activityTypeRepo.findAll().stream().map(typeDisplayDtoMapper::getTypeDisplayDto).toList();
    }

    @PreAuthorize(Permissions.FHTL)
    @PostMapping("/type/general/{id}")
    public List<TypeDisplayDto> updateGeneralType(@PathVariable("id") Integer id){
        activityTypeService.setGeneralType(id);
        return activityTypeRepo.findAll().stream().map(typeDisplayDtoMapper::getTypeDisplayDto).toList();
    }

    @GetMapping("/type/common")
    public List<TypeDisplayDto> getCommonTypes(){
        return activityTypeRepo.findAll().stream().filter(type-> !type.isGeneral()).map(typeDisplayDtoMapper::getTypeDisplayDto).toList();
    }
}
