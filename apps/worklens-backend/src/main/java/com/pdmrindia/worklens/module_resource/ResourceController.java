package com.pdmrindia.worklens.module_resource;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class ResourceController {

    @Value("${file.uploadDirectory}")
    private String uploadDirectory;

    @Value("${file.displayPictureDirectory}")
    private String displayPictureDirectory;

    private final ResourceService resourceService;


    @GetMapping("/dp/{filename:.+}")
    public ResponseEntity<org.springframework.core.io.Resource> getProfilePic(@PathVariable String filename){

        try{

            Path fileStorageLocation = Paths.get(displayPictureDirectory).toAbsolutePath().normalize();
            Path targetPath = fileStorageLocation.resolve(filename).normalize();

            Resource resource = new UrlResource(targetPath.toUri());

            // Check that the resolved path is still under uploadDir
            // If not - reject the request
            if (!targetPath.startsWith(fileStorageLocation)) {
                return ResponseEntity.badRequest().build();
            }

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(targetPath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }
}
