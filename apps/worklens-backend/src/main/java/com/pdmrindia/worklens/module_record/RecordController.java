package com.pdmrindia.worklens.module_record;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class RecordController {

    @GetMapping("/records")
    public List<String> getRecordTypes() {
        return Arrays.stream(Record.values())
                .map(Enum::name)
                .toList();
    }
}
