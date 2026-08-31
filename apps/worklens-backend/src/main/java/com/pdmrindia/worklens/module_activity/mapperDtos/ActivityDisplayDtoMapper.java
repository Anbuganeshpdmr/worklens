package com.pdmrindia.worklens.module_activity.mapperDtos;

import com.pdmrindia.worklens.module_activity.Activity;
import com.pdmrindia.worklens.module_activity_type.mapperDtos.TypeDisplayDtoMapper;
import com.pdmrindia.worklens.module_category.mapperDtos.CategoryDisplayDtoMapper;
import com.pdmrindia.worklens.module_project.Project;
import com.pdmrindia.worklens.module_project.mapperDtos.SimpleProjectInfoDtoMapper;
import com.pdmrindia.worklens.module_status.mapperDtos.StatusDisplayDto;
import com.pdmrindia.worklens.module_status.mapperDtos.StatusDisplayDtoMapper;
import com.pdmrindia.worklens.module_user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ActivityDisplayDtoMapper {

    private final SimpleProjectInfoDtoMapper simpleProjectInfoDtoMapper;
    private final StatusDisplayDtoMapper statusMapper;
    private final CategoryDisplayDtoMapper categoryMapper;
    private final TypeDisplayDtoMapper typeMapper;

    public ActivityDisplayDto getActivityDisplayDto(Activity activity){
        ActivityDisplayDto dto = new ActivityDisplayDto();

        dto.setActivityId(activity.getId());
        dto.setTitle(activity.getTitle());
        dto.setDescription(activity.getDescription());

        dto.setVersion(activity.getVersion());

        dto.setActivityType(typeMapper.getSimpleTypeDto(activity.getActivityType()));
        dto.setCategory(categoryMapper.getSimpleCategoryDispDto(activity.getActivityType().getCategory()));

        dto.setCreatedBy(activity.getCreatedBy().getName());
        dto.setCreatedOn(activity.getCreatedOn().toString());

        StatusDisplayDto recordStatusDisplayDto = statusMapper.getStatusDisplayDto(activity.getStatus());
        dto.setCurrentStatus(recordStatusDisplayDto);

        User updatedByUser = activity.getUpdatedBy();
        if(updatedByUser!=null){
            dto.setUpdatedBy(updatedByUser.getName());
            dto.setUpdatedOn(activity.getUpdatedOn().toString());
        }

        Project project = activity.getProject();
        if(project!=null){
            dto.setProjectDetails(simpleProjectInfoDtoMapper.getSimpleProjectDisplayDto(project));
        }

        dto.setExternalTicketId(activity.getExternalTicketId());

        Activity parentActivity = activity.getParentActivity();
        if(parentActivity!=null){
            dto.setParentActivityId(activity.getParentActivity().getId());
        }

        return dto;
    }
}
