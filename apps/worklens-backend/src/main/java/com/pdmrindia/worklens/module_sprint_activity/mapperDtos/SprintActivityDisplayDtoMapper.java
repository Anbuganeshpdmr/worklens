package com.pdmrindia.worklens.module_sprint_activity.mapperDtos;

import com.pdmrindia.worklens.module_activity.mapperDtos.ActivityDisplayDtoMapper;
import com.pdmrindia.worklens.module_record_status.mapperDtos.RecordStatusDisplayDto;
import com.pdmrindia.worklens.module_record_status.mapperDtos.RecordStatusDisplayDtoMapper;
import com.pdmrindia.worklens.module_sprint.Sprint;
import com.pdmrindia.worklens.module_sprint.mapperDtos.SimpleSprintInfoDtoMapper;
import com.pdmrindia.worklens.module_sprint_activity.SprintActivity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SprintActivityDisplayDtoMapper {

    private final SimpleSprintInfoDtoMapper simpleSprintInfoDtoMapper;
    private final ActivityDisplayDtoMapper activityDisplayDtoMapper;
    private final RecordStatusDisplayDtoMapper rsMapper;

    public SprintActivityDisplayDto getSprintActivityDisplayDto(SprintActivity sprintActivity){
        SprintActivityDisplayDto dto = new SprintActivityDisplayDto();

        dto.setSprintActivityId(sprintActivity.getId());
        dto.setVersion(sprintActivity.getVersion());

        RecordStatusDisplayDto recordStatusDisplayDto = rsMapper.getRecordStatusDisplayDto(sprintActivity.getRecordStatus());
        dto.setCurrentStatus(recordStatusDisplayDto);

        dto.setSimpleActivityInfo(activityDisplayDtoMapper.getActivityDisplayDto(sprintActivity.getActivity()));

        Sprint sprint = sprintActivity.getSprint();
        if(sprint != null){
            dto.setSimpleSprintInfo(simpleSprintInfoDtoMapper.getSimpleSprintInfo(sprint));
        }

        return dto;
    }
}
