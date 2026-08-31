package com.pdmrindia.worklens.module_activity_type;

import com.pdmrindia.worklens.module_activity_type.mapperDtos.NewTypeDto;
import com.pdmrindia.worklens.module_activity_type.mapperDtos.TypeDisplayDto;
import com.pdmrindia.worklens.module_activity_type.mapperDtos.TypeDisplayDtoMapper;
import com.pdmrindia.worklens.module_activity_type.mapperDtos.UpdateTypeDto;
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
    private final TypeDisplayDtoMapper typeDisplayDtoMapper;

    @PostMapping("/type")
    public TypeDisplayDto addNewOptionalType(@RequestBody NewTypeDto newTypeDto){
        ActivityType type = activityTypeService.createOptionalType(newTypeDto);
        return typeDisplayDtoMapper.getTypeDisplayDto(type);
    }

    @PutMapping("type")
    public TypeDisplayDto editType(@RequestBody UpdateTypeDto updateTypeDto){
        ActivityType type = activityTypeService.updateType(updateTypeDto);
        return typeDisplayDtoMapper.getTypeDisplayDto(type);
    }

    @GetMapping("type/{typeId}")
    public TypeDisplayDto getType(@PathVariable("typeId") int id){
        return typeDisplayDtoMapper.getTypeDisplayDto(activityTypeService.getTypeById(id));
    }

    @GetMapping("type/category/{categoryId}")
    public List<TypeDisplayDto> getCategoryTypes(@PathVariable("categoryId") int id){
        return activityTypeService.getTypesByCategory(id).stream().map(typeDisplayDtoMapper::getTypeDisplayDto).toList();
    }
}
