package com.pdmrindia.worklens.module_user.mapperDtos;

import com.pdmrindia.worklens.module_user.OpenprojectCredentialService;
import com.pdmrindia.worklens.module_user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OP_CredentialMapper {

    private final OpenprojectCredentialService openprojectCredentialService;

    public OpenprojectCredentials getOpCredentials(User user){
        OpenprojectCredentials credentials = new OpenprojectCredentials();

        credentials.setOpenProjectApiUsername(user.getOpenprojectApiUsername());

        String decryptedKey = openprojectCredentialService
                .decrypt(user.getOpenprojectApiPassword());
        credentials.setOpenProjectApiPassword(decryptedKey);
        System.out.println("Decrypted: "+decryptedKey);
        return credentials;
    }
}
