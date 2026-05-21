package br.com.agendamento.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    private final Key secretKey;
    private final long expirationMs;

    /**
     * Constrói o JwtUtil com a chave secreta fixa definida em application.properties.
     * Usar uma chave fixa garante que os tokens permanecem válidos mesmo após o
     * servidor ser reiniciado — o bug principal que causava 403.
     */
    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration:86400000}") long expiration) {

        // Decodifica a chave Base64 e cria uma Key HMAC-SHA256
        byte[] keyBytes = Base64.getDecoder().decode(secret);
        // Garante pelo menos 256 bits (32 bytes)
        if (keyBytes.length < 32) {
            // Fallback: deriva via Keys.hmacShaKeyFor usando UTF-8 se o decode for curto
            keyBytes = java.util.Arrays.copyOf(keyBytes, 32);
        }
        this.secretKey   = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expiration;
    }

    public String extrairEmail(String token) {
        return extrairClaim(token, Claims::getSubject);
    }

    public Date extrairExpiracao(String token) {
        return extrairClaim(token, Claims::getExpiration);
    }

    public <T> T extrairClaim(String token, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(extrairTodasClaims(token));
    }

    private Claims extrairTodasClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private boolean isTokenExpirado(String token) {
        return extrairExpiracao(token).before(new Date());
    }

    public String gerarToken(String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validarToken(String token, String email) {
        try {
            final String extraido = extrairEmail(token);
            return extraido.equals(email) && !isTokenExpirado(token);
        } catch (Exception e) {
            return false;
        }
    }
}
