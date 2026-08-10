package com.pdmrindia.worklens.module_status;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class StatusController {

    private final StatusService statusService;
    private final StatusRepo statusRepo;

    @PostMapping("/status")
    public Status addNewStatus(@RequestBody Status status){
        return statusService.createStatus(status);
    }

    @PutMapping("status/{id}")
    public Status editStatus(@PathVariable("id") int id, @RequestBody Status status){
        return statusService.updateStatus(id,status);
    }

    @GetMapping("status/all")
    public List<Status> getAllStatus(){
        return statusRepo.findAll();
    }

}
