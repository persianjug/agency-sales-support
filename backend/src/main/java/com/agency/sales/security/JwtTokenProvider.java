package com.agency.sales.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import javax.crypto.SecretKey;

@Component
public class JwtTokenProvider {
  private final SecretKey key;
  private final long expirationTime;

  public JwtTokenProvider(
      @Value("${jwt.secret}") String secret,
      @Value("${jwt.expiration}") long expirationTime) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.expirationTime = expirationTime;
  }

  public String generateToken(String usernmae, String role) {

    Instant now = Instant.now();
    Instant expiryDate = now.plus(expirationTime, ChronoUnit.MILLIS);

    return (
      Jwts.builder()
        .subject(usernmae)
        .claim("role", role)
        .issuedAt(Date.from(now))
        .expiration(Date.from(expiryDate))
        .signWith(key)
        .compact()
    );
  }

}
