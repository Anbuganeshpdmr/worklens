package com.pdmrindia.worklens.module_activity.mapperDtos;

import com.pdmrindia.worklens.module_activity.Activity;
import com.pdmrindia.worklens.module_project.Project;
import com.pdmrindia.worklens.module_project.mapperDtos.SimpleProjectInfoDtoMapper;
import com.pdmrindia.worklens.module_record_status.mapperDtos.RecordStatusDisplayDto;
import com.pdmrindia.worklens.module_record_status.mapperDtos.RecordStatusDisplayDtoMapper;
import com.pdmrindia.worklens.module_user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ActivityDisplayDtoMapper {

    private final SimpleProjectInfoDtoMapper simpleProjectInfoDtoMapper;
    private final RecordStatusDisplayDtoMapper rsMapper;

    public ActivityDisplayDto getActivityDisplayDto(Activity activity){
        ActivityDisplayDto dto = new ActivityDisplayDto();

        dto.setActivityId(activity.getId());
        dto.setTitle(activity.getTitle());
        dto.setDescription(activity.getDescription());

        dto.setVersion(activity.getVersion());

        dto.setActivityType(activity.getActivityType());

        dto.setCreatedBy(activity.getCreatedBy().getName());
        dto.setCreatedOn(activity.getCreatedOn().toString());

        RecordStatusDisplayDto recordStatusDisplayDto = rsMapper.getRecordStatusDisplayDto(activity.getRecordStatus());
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
