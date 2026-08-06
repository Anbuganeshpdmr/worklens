package com.pdmrindia.worklens.jwt;

import com.pdmrindia.worklens.model.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil{

    @Value("${jwt_key}")
    private String secretKey;

    @Value("${jwt_secret}")
    private String SECRET;

    private static final long EXPIRATION_TIME = 12 * 60 * 60 * 1000; // 12 hrs in millis

    private SecretKey getKey() {
        //byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        byte[] keyBytes = SECRET.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(User currentUser) {

        Map<String, String> customClaims = new HashMap<>();
        customClaims.putIfAbsent("Role",currentUser.getRole().getName());
        customClaims.putIfAbsent("Email-Id",currentUser.getEmailId());
        customClaims.putIfAbsent("Name",currentUser.getName());

        return Jwts.builder()
                .claims()
                .add(customClaims)
                .subject(currentUser.getEmpId())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .and()
                .signWith(getKey())
                .compact();
    }

    private Claims extractClaims(String token){
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver){
        final Claims allClaims = extractClaims(token);
        return claimResolver.apply(allClaims);
    }

    // JWT validated based on token expiration Time only
    // Upon validation - will return the Emp-Id
    public String validateAndGetEmpId(String token) {

        Date tokenExpiration = extractClaim(token, Claims::getExpiration);
        if(tokenExpiration.before(new Date())){
            throw new RuntimeException("Jwt Expired");
        }
        return extractTokenSubject(token);
    }

    public String extractTokenSubject(String token) {
        return extractClaim(token,Claims::getSubject);
    }

}
