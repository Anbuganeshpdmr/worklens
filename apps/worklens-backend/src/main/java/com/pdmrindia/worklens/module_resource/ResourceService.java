package com.pdmrindia.worklens.module_resource;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepo resourceRepo;

    @Value("${file.uploadDirectory}")
    private String uploadDirectory;

    @Value("${file.displayPictureDirectory}")
    private String displayPictureDirectory;

    public String setProfilePicture(MultipartFile profilePic){
        try {
            String originalFilename = profilePic.getOriginalFilename();
            String uniqueFileName = UUID.randomUUID() + "_" + originalFilename;

            Path uploadPath = Paths.get(displayPictureDirectory).resolve(uniqueFileName);
            System.out.println("Upload Path: "+uploadPath);

            Files.createDirectories(uploadPath.getParent());
            profilePic.transferTo(uploadPath.toFile());

            return uniqueFileName;

        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public String getOriginalFileName(String uniqueFileName){
        return resourceRepo.findByUniqueFileName(uniqueFileName)
                .map(Resource::getOriginalFileName)
                .orElse(null);
    }
}
