package com.pdmrindia.worklens.module_entry.mapperDtos;

import com.pdmrindia.worklens.module_activity_type.mapperDtos.TypeDisplayDtoMapper;
import com.pdmrindia.worklens.module_category.mapperDtos.CategoryDisplayDtoMapper;
import com.pdmrindia.worklens.module_entry.Entry;
import com.pdmrindia.worklens.module_status.mapperDtos.StatusDisplayDtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class EntryDisplayDtoMapper {

    private final StatusDisplayDtoMapper statusDisplayDtoMapper;
    private final CategoryDisplayDtoMapper categoryMapper;
    private final TypeDisplayDtoMapper typeMapper;

    public EntryDisplayDto getEntryDisplayDto(Entry entry){
        if(entry==null) return null;

        EntryDisplayDto dto = new EntryDisplayDto();

        dto.setId(entry.getId());
        dto.setName(entry.getName());
        dto.setDescription(entry.getDescription());
        dto.setRemarks(entry.getRemarks());
        dto.setActivityDate(entry.getActivityDate().toString());
        dto.setStartTime(entry.getStartTime().toString());
        if(entry.getEndTime()!=null){
            dto.setEndTime(entry.getEndTime().toString());
            dto.setDuration(entry.getDuration().toString());
        }
        dto.setUser(entry.getUser().getName());
        dto.setCurrentStatus(statusDisplayDtoMapper.getStatusDisplayDto(entry.getStatus()));
        dto.setExternalTicketId(entry.getExternalTicketId());
        dto.setActivityId(entry.getActivity().getId());

        dto.setActivityType(typeMapper.getSimpleTypeDto(entry.getActivity().getActivityType()));
        dto.setCategory(categoryMapper.getSimpleCategoryDispDto(entry.getActivity().getCategory()));

        dto.setSprintActivityId(entry.getSprintActivity() != null ? entry.getSprintActivity().getId() : null);
        dto.setSprintName(entry.getSprintActivity() != null ? entry.getSprintActivity().getSprint().getName() : null);
        dto.setProjectName(entry.getActivity().getProject() != null ? entry.getActivity().getProject().getName() : null);

        LocalDateTime exactStartTime = LocalDateTime.of(entry.getActivityDate(),entry.getStartTime());
        if(entry.getActivityEndDate()!=null && entry.getEndTime()!=null){

            LocalDateTime exactEndTime = LocalDateTime.of(entry.getActivityEndDate(),entry.getEndTime());
            dto.setDuration2(Duration.between(exactStartTime, exactEndTime).toString());
        }


        return dto;
    }
}
