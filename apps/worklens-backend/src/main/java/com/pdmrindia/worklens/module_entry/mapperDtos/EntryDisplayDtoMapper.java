package com.pdmrindia.worklens.module_entry.mapperDtos;

import com.pdmrindia.worklens.module_activity_type.mapperDtos.TypeDisplayDtoMapper;
import com.pdmrindia.worklens.module_category.mapperDtos.CategoryDisplayDtoMapper;
import com.pdmrindia.worklens.module_entry.Entry;
import com.pdmrindia.worklens.module_status.mapperDtos.StatusDisplayDtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Duration;

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
        dto.setActivityDate(entry.getStartDateTime().toLocalDate().toString());
        dto.setStartTime(entry.getStartDateTime().toLocalTime().toString());
        if(entry.getEndDateTime()!=null){
            dto.setActivityEndDate(entry.getEndDateTime().toLocalDate().toString());
            dto.setEndTime(entry.getEndDateTime().toLocalTime().toString());
            dto.setDuration(Duration.between(entry.getStartDateTime(), entry.getEndDateTime()).toString());
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

        return dto;
    }
}
