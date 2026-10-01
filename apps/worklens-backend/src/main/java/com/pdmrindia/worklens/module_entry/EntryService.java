package com.pdmrindia.worklens.module_entry;

import com.pdmrindia.worklens.exception.EntryException;
import com.pdmrindia.worklens.module_activity.Activity;
import com.pdmrindia.worklens.module_activity.ActivityService;
import com.pdmrindia.worklens.module_entry.filter.EntryFilterRequest;
import com.pdmrindia.worklens.module_entry.filter.EntrySpecification;
import com.pdmrindia.worklens.module_entry.mapperDtos.CloseGeneralEntryDto;
import com.pdmrindia.worklens.module_entry.mapperDtos.CloseWorkEntryDto;

import com.pdmrindia.worklens.module_status.Record;
import com.pdmrindia.worklens.module_sprint_activity.SprintActivity;
import com.pdmrindia.worklens.module_sprint_activity.SprintActivityService;
import com.pdmrindia.worklens.module_status.Status;
import com.pdmrindia.worklens.module_status.StatusService;
import com.pdmrindia.worklens.module_user.CurrentUserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EntryService {

    private final EntryRepo entryRepo;
    //private final SprintActivityService sprintActivityService;
    private final CurrentUserService currentUserService;
    private final StatusService statusService;
    private final ActivityService activityService;

    /*@Transactional
    public Entry createNewWorkEntry(int sprintActivityId){
        //  Ensure user has all previous entries closed
        checkUserUnclosedEntry();

        Entry entry = new Entry();

        SprintActivity sprintActivity = sprintActivityService.getSprintActivityById(sprintActivityId);

        //  Ensure Related Spr-Activity has no unclosed entries
        validateSprintActivityAvailableForTesting(sprintActivity);

        Activity activity = sprintActivity.getActivity();

        //  validate Activity status before starting first Entry
        activity = activityService.processActivityStatusForEntry(activity);

        entry.setName(activity.getTitle());
        entry.setDescription(activity.getDescription());
        entry.setActivity(activity);
        entry.setUser(currentUserService.user());
        entry.setActivityDate(LocalDate.now());
        entry.setStartTime(LocalTime.now());
        entry.setExternalTicketId(activity.getExternalTicketId() != null ? activity.getExternalTicketId() : null);

        //  Setting Entry Status
        Status entryStatus = statusService.getRecordStatusByName(Record.ENTRY,"in-process");
        statusService.validateRecordStatusOfRecord(Record.ENTRY,entryStatus);
        entry.setStatus(entryStatus);

        //  Setting Sprint-Activity Status to "in-testing"
        sprintActivityService.updateStatus(sprintActivity,statusService.getRecordStatusByName(Record.SPRINT_ACTIVITY,"in-testing"));
        entry.setSprintActivity(sprintActivity);

        return entryRepo.save(entry);
    }*/

    @Transactional
    public Entry createNewWorkEntry2(SprintActivity sprintActivity){
        //  Ensure user has all previous entries closed
        checkUserUnclosedEntry();

        Entry entry = new Entry();

        Activity activity = sprintActivity.getActivity();

        //  validate Activity status before starting first Entry
        activity = activityService.processActivityStatusForEntry(activity);

        entry.setName(activity.getTitle());
        entry.setDescription(activity.getDescription());
        entry.setActivity(activity);
        entry.setUser(currentUserService.user());
        entry.setActivityDate(LocalDate.now());
        entry.setStartTime(LocalTime.now());
        entry.setExternalTicketId(activity.getExternalTicketId() != null ? activity.getExternalTicketId() : null);

        //  Setting Entry Status
        Status entryStatus = statusService.getRecordStatusByName(Record.ENTRY,"in-process");
        statusService.validateRecordStatusOfRecord(Record.ENTRY,entryStatus);
        entry.setStatus(entryStatus);

        //  Setting Sprint-Activity Status to "in-testing"
        //sprintActivityService.startSprintActivityUtil(sprintActivity,statusService.getRecordStatusByName(Record.SPRINT_ACTIVITY,"in-testing"));
        entry.setSprintActivity(sprintActivity);

        return entryRepo.save(entry);
    }

    /*@Transactional
    public Entry closeWorkEntry(CloseWorkEntryDto closeWorkEntryDto){
        Entry currentEntry = getEntryById(closeWorkEntryDto.getEntryId());

        validateEntryClosingUser(currentEntry);

        LocalTime endTime = LocalTime.now();
        currentEntry.setEndTime(endTime);
        currentEntry.setDuration(Duration.between(currentEntry.getStartTime(), endTime));
        currentEntry.setRemarks(closeWorkEntryDto.getRemarks());

        Status SA_NewSelectedStatus = statusService.getStatusById(closeWorkEntryDto.getSprintActivityStatusId());
        setEntryStatus(currentEntry, SA_NewSelectedStatus);

        //  Setting Sprint-Activity Status
        sprintActivityService.updateStatus(currentEntry.getSprintActivity(), SA_NewSelectedStatus);

        return entryRepo.save(currentEntry);
    }*/

    @Transactional
    public Entry closeWorkEntry2(Entry currentEntry, String remarks){

        if (currentEntry == null) {
            throw new IllegalArgumentException("No active entry found to close.");
        }
        validateEntryClosingUser(currentEntry);

        LocalDate endDate = LocalDate.now();
        LocalTime endTime = LocalTime.now();

        currentEntry.setActivityEndDate(endDate);
        currentEntry.setEndTime(endTime);

        LocalDateTime exactStartTime = LocalDateTime.of(currentEntry.getActivityDate(),currentEntry.getStartTime());
        LocalDateTime exactEndTime = LocalDateTime.of(endDate,endTime);

        currentEntry.setDuration(Duration.between(exactStartTime, exactEndTime));
        currentEntry.setRemarks(remarks);

        Status entryStatus = statusService.getRecordStatusByName(Record.ENTRY,"complete");
        statusService.validateRecordStatusOfRecord(Record.ENTRY,entryStatus);
        currentEntry.setStatus(entryStatus);

        return currentEntry;
        //return entryRepo.save(currentEntry);
    }

    @Transactional
    public Entry createNewGeneralEntry(int activityId){
        //  Ensure user has all previous entries closed
        checkUserUnclosedEntry();

        Entry entry = new Entry();

        Activity activity = activityService.getActivityById(activityId);

        //  validate Activity status before starting first Entry
        activity = activityService.processActivityStatusForEntry(activity);

        entry.setName(activity.getTitle());
        entry.setDescription(activity.getDescription());
        entry.setActivity(activity);
        entry.setUser(currentUserService.user());
        entry.setActivityDate(LocalDate.now());
        entry.setStartTime(LocalTime.now());
        entry.setExternalTicketId(activity.getExternalTicketId() != null ? activity.getExternalTicketId() : null);

        //  Setting Entry Status
        Status entryStatus = statusService.getRecordStatusByName(Record.ENTRY,"in-process");
        statusService.validateRecordStatusOfRecord(Record.ENTRY,entryStatus);
        entry.setStatus(entryStatus);

        return entryRepo.save(entry);
    }

    @Transactional
    public Entry closeGeneralEntry(CloseGeneralEntryDto closeGeneralEntryDto){
        Entry currentEntry = getEntryById(closeGeneralEntryDto.getEntryId());

        validateEntryClosingUser(currentEntry);

        LocalTime endTime = LocalTime.now();
        currentEntry.setEndTime(endTime);
        currentEntry.setDuration(Duration.between(currentEntry.getStartTime(), endTime));
        currentEntry.setRemarks(closeGeneralEntryDto.getRemarks());

        //  Setting Entry Status
        Status updatedStatus = statusService.getRecordStatusByName(Record.ENTRY,"complete");
        statusService.validateRecordStatusOfRecord(Record.ENTRY,updatedStatus);
        currentEntry.setStatus(updatedStatus);

        return entryRepo.save(currentEntry);
    }

    private void checkUserUnclosedEntry(){
        //Status inProcessStatus = statusService.getRecordStatusByName(Record.ENTRY,"in-process");
        List<Entry> entries = entryRepo.findByUserAndEndTimeIsNull(currentUserService.user());
        System.out.println("UNFINISHED ENTRIES = " + entries.size());
        if(entries.size()>0){
            //throw new EntryException.UnclosedEntryException("Kindly close previous entries!");
        }
    }

    public Entry getEntryById(long id){
        return entryRepo.findById(id)
                .orElseThrow(()-> new EntryException.EntryNotFoundException("No Valid Entry found with ID: "+id));
    }

    public Page<Entry> search(EntryFilterRequest request, Pageable pageable) {
        Specification<Entry> specification = EntrySpecification.withFilters(request);
        return entryRepo.findAll(specification, pageable);
    }

    public List<Entry> fetch(EntryFilterRequest request) {
        Specification<Entry> specification = EntrySpecification.withFilters(request);
        return entryRepo.findAll(specification);
    }

    private void validateEntryClosingUser(Entry entry){
        if(!entry.getUser().equals(currentUserService.user())){
            throw new EntryException.UnauthorisedEntryAccessException("Entry must be closed by its owner: "+entry.getUser().getName());
        }
    }

    private Entry setEntryStatus(Entry entry, Status SA_NewStatus){
        Status SA_CurrentStatus = entry.getSprintActivity().getStatus();

        if(SA_CurrentStatus==SA_NewStatus){
            //  SA-status not changed
            //  Hence Entry set to HOLD
            entry.setStatus(statusService.getRecordStatusByName(Record.ENTRY,"hold"));
        }else{
            //  SA-status changed from previous
            //  Hence Entry set to COMPLETE
            entry.setStatus(statusService.getRecordStatusByName(Record.ENTRY,"complete"));
        }
        return entry;
    }

    private void validateSprintActivityAvailableForTesting(SprintActivity sprintActivity){

        Status inProcessStatus = statusService.getRecordStatusByName(Record.ENTRY,"in-process");
        statusService.validateRecordStatusOfRecord(Record.ENTRY,inProcessStatus);

        List<Entry> relatedUnclosedEntries = entryRepo.findBySprintActivityAndStatus(sprintActivity,inProcessStatus);
        System.out.println("Size: "+relatedUnclosedEntries.size());
        if(!relatedUnclosedEntries.isEmpty()){
            throw new EntryException.UnclosedEntryException("Related Sprint-Activity currently in testing");
        }

    }

    public Entry getUserCurrentEntry() {
        List<Entry> currentOpenEntries = entryRepo.findByUserAndEndTimeIsNull(currentUserService.user());
        System.out.println("Open Entries:"+currentOpenEntries.size());
        if(currentOpenEntries.isEmpty()) {
            return null;
        }else if(currentOpenEntries.size() == 1){
            return currentOpenEntries.get(0);
        }else{
            throw new EntryException.UnclosedEntryException("Max Allowed limit is 1! Detected open Entries: "+currentOpenEntries.size());
        }
    }
}
