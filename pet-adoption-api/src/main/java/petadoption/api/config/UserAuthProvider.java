package petadoption.api.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import petadoption.api.user.UserService;

import java.util.Base64;
import java.util.Date;

@RequiredArgsConstructor
@Component
public class UserAuthProvider {
    // Need a secret key, generated in the application.yml
    @Value("${security.jwt.token.secret-key:secret-value}")
    private String secretKey;

    private final UserService userService;

    @PostConstruct
    protected void init() {
        // Avoid key being plain text in the JVM
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    public String createToken(UserDetails userDetails) {
        // Jwt token valid for one hour after being issued
        String email = userDetails.getUsername();
        Date now = new Date();
        Date validity = new Date(now.getTime() + 3_600_000);

        return JWT.create()
                .withIssuer(email)
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .withClaim("role", userDetails.getAuthorities().toString())
                .sign(Algorithm.HMAC256(secretKey));
    }

    public DecodedJWT verifyToken(String token) {
        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secretKey))
                .build();
        // Decode the token in order to verify it, if the validity date
        // is expired, an exception is thrown
        return verifier.verify(token);

    }
}
