package com.pdmrindia.worklens.module_entry;

import com.pdmrindia.worklens.module_entry.filter.EntryFilterRequest;
import com.pdmrindia.worklens.module_entry.mapperDtos.CloseWorkEntryDto;
import com.pdmrindia.worklens.module_entry.mapperDtos.EntryDisplayDto;
import com.pdmrindia.worklens.module_entry.mapperDtos.EntryDisplayDtoMapper;

import com.pdmrindia.worklens.module_user.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;


@RestController
@RequestMapping
@RequiredArgsConstructor
public class EntryController {

    private final EntryService entryService;
    private final EntryDisplayDtoMapper entryDisplayDtoMapper;
    private final CurrentUserService currentUserService;

    @PostMapping("/entry/test/{sprintActivityId}")
    public EntryDisplayDto createNewTestEntry(@PathVariable("sprintActivityId") int sprintActivityId){
        Entry entry = entryService.createNewTestEntry(sprintActivityId);
        return entryDisplayDtoMapper.getEntryDisplayDto(entry);
    }

    @PutMapping("/entry/test")
    public EntryDisplayDto closeTestEntry(@RequestBody CloseWorkEntryDto closeWorkEntryDto){
        Entry entry = entryService.closeTestEntry(closeWorkEntryDto);
        return entryDisplayDtoMapper.getEntryDisplayDto(entry);
    }

    @PostMapping("/entry/non_test/{activityId}")
    public EntryDisplayDto createNewNonTestEntry(@PathVariable("activityId") int activityId){
        Entry entry = entryService.createNewNonTestEntry(activityId);
        return entryDisplayDtoMapper.getEntryDisplayDto(entry);
    }

    @PutMapping("/entry/non_test")
    public EntryDisplayDto closeNonTestEntry(@RequestBody CloseWorkEntryDto closeWorkEntryDto){
        Entry entry = entryService.closeNonTestEntry(closeWorkEntryDto);
        return entryDisplayDtoMapper.getEntryDisplayDto(entry);
    }

    @PostMapping("/entry/me/today")
    public Page<EntryDisplayDto> getUserTodayEntries(Pageable pageable){

        EntryFilterRequest request = new EntryFilterRequest();
        LocalDate today = LocalDate.now();
        request.setFromDate(today);
        request.setToDate(today);
        request.setUserIds(List.of(currentUserService.user().getId()));

        Page<Entry> entryPage = entryService.search(request, pageable);
        return entryPage.map(entryDisplayDtoMapper::getEntryDisplayDto);
    }

    @PostMapping("/entry/all/today")
    public Page<EntryDisplayDto> getAllUsersTodayEntries(Pageable pageable){

        EntryFilterRequest request = new EntryFilterRequest();
        LocalDate today = LocalDate.now();
        request.setFromDate(today);
        request.setToDate(today);

        Page<Entry> entryPage = entryService.search(request, pageable);
        return entryPage.map(entryDisplayDtoMapper::getEntryDisplayDto);
    }

    @PostMapping("/entry/search")
    public Page<EntryDisplayDto> search(@RequestBody EntryFilterRequest request, Pageable pageable) {
        Page<Entry> entryPage = entryService.search(request, pageable);
        return entryPage.map(entryDisplayDtoMapper::getEntryDisplayDto);
    }

}
