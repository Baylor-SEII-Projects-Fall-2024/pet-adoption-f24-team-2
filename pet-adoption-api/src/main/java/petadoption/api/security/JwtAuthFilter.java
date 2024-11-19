package petadoption.api.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.filter.OncePerRequestFilter;
import petadoption.api.config.UserAuthProvider;
import petadoption.api.user.CustomUserDetails;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.io.IOException;

@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final UserAuthProvider userAuthProvider;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        // Check the authorization header
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        // Check if the credentials are valid, and if so add the
        // authentication bean to the security context
        // Adding this to the context allows the use of the
        // @AuthenticationPrincipal annotation as an input
        // parameter to controllers, allowing the filter to
        // give the controller the current authenticated user
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            try {
                // Validate the token and extract the email
                DecodedJWT decodedJWT = userAuthProvider.verifyToken(token);
                String email = decodedJWT.getIssuer();

                // Load user details using the email from the token
                CustomUserDetails userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername(email);

                // set the authentication in the security context
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                // If something goes wrong, clear the context
                SecurityContextHolder.clearContext();
                throw new ServletException("Invalid JWT token", e);
            }
        }

        // Apply the filter
        filterChain.doFilter(request, response);
    }
}
