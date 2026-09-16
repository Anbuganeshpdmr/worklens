package com.pdmrindia.worklens.module_sprint_activity.mapperDtos;

import com.pdmrindia.worklens.module_activity.mapperDtos.ActivityDisplayDtoMapper;
import com.pdmrindia.worklens.module_sprint.Sprint;
import com.pdmrindia.worklens.module_sprint.mapperDtos.SimpleSprintInfoDtoMapper;
import com.pdmrindia.worklens.module_sprint_activity.SprintActivity;
import com.pdmrindia.worklens.module_status.mapperDtos.StatusDisplayDto;
import com.pdmrindia.worklens.module_status.mapperDtos.StatusDisplayDtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SprintActivityDisplayDtoMapper {

    private final SimpleSprintInfoDtoMapper simpleSprintInfoDtoMapper;
    private final ActivityDisplayDtoMapper activityDisplayDtoMapper;
    private final StatusDisplayDtoMapper statusMapper;

    public SprintActivityDisplayDto getSprintActivityDisplayDto(SprintActivity sprintActivity){
        SprintActivityDisplayDto dto = new SprintActivityDisplayDto();

        dto.setSprintActivityId(sprintActivity.getId());
        dto.setVersion(sprintActivity.getVersion());

        StatusDisplayDto recordStatusDisplayDto = statusMapper.getStatusDisplayDto(sprintActivity.getStatus());
        dto.setCurrentStatus(recordStatusDisplayDto);

        dto.setSimpleActivityInfo(activityDisplayDtoMapper.getActivityDisplayDto(sprintActivity.getActivity()));

        Sprint sprint = sprintActivity.getSprint();
        if(sprint != null){
            dto.setSimpleSprintInfo(simpleSprintInfoDtoMapper.getSimpleSprintInfo(sprint));
        }

        return dto;
    }
}
