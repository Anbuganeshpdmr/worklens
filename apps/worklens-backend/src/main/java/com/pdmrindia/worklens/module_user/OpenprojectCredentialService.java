package com.pdmrindia.worklens.module_user;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class OpenprojectCredentialService {

    /*@Value("${worklens.encryption.key}")
    private final String encryptionKey;*/

    //private final CurrentUserService currentUserService;

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int IV_LENGTH = 12;
    private static final int TAG_LENGTH = 128;

    private final SecretKeySpec secretKey;
    private final SecureRandom secureRandom = new SecureRandom();

    public OpenprojectCredentialService(
            @Value("${openproject_user_apikey_encryption_key}") String key) {

        byte[] decodedKey = Base64.getDecoder().decode(key);

        if (decodedKey.length != 32) {
            throw new IllegalArgumentException(
                    "Encryption key must be 32 bytes"
            );
        }

        this.secretKey = new SecretKeySpec(decodedKey, "AES");
    }

    public String encrypt(String plainText) {
        try {
            byte[] iv = new byte[IV_LENGTH];
            secureRandom.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(
                    Cipher.ENCRYPT_MODE,
                    secretKey,
                    new GCMParameterSpec(TAG_LENGTH, iv)
            );

            byte[] encrypted = cipher.doFinal(
                    plainText.getBytes(StandardCharsets.UTF_8)
            );

            // Store IV + encrypted data together.
            byte[] combined = ByteBuffer.allocate(
                    iv.length + encrypted.length
            ).put(iv).put(encrypted).array();

            return Base64.getEncoder().encodeToString(combined);

        } catch (Exception e) {
            throw new IllegalStateException(
                    "Could not encrypt API key", e
            );
        }
    }

    public String decrypt(String encryptedText) {
        try {
            byte[] combined = Base64.getDecoder()
                    .decode(encryptedText);

            if (combined.length <= IV_LENGTH) {
                throw new IllegalArgumentException(
                        "Invalid encrypted API key"
                );
            }

            ByteBuffer buffer = ByteBuffer.wrap(combined);

            byte[] iv = new byte[IV_LENGTH];
            buffer.get(iv);

            byte[] encrypted = new byte[buffer.remaining()];
            buffer.get(encrypted);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(
                    Cipher.DECRYPT_MODE,
                    secretKey,
                    new GCMParameterSpec(TAG_LENGTH, iv)
            );

            return new String(
                    cipher.doFinal(encrypted),
                    StandardCharsets.UTF_8
            );

        } catch (Exception e) {
            throw new IllegalStateException(
                    "Could not decrypt API key", e
            );
        }
    }
}
