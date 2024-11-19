package petadoption.api.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import petadoption.api.config.UserAuthProvider;

import java.io.IOException;

@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final UserAuthProvider userAuthProvider;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        // Check the authorization header
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (header != null) {
            String[] elements = header.split(" ");

            // Check if the credentials are valid, and if so add the
            // authentication bean to the security context
            // Adding this to the context allows the use of the
            // @AuthenticationPrincipal annotation as an input
            // parameter to controllers, allowing the filter to
            // give the controller the current authenticated user
            if (elements.length == 2 && "Bearer".equals(elements[0])) {
                try {
                    SecurityContextHolder.getContext().setAuthentication(
                            userAuthProvider.validateToken(elements[1])
                    );
                } catch (RuntimeException e) {
                    // If something goes wrong, clear the context
                    SecurityContextHolder.clearContext();
                    throw e;
                }
            }
        }

        // Apply the filter
        filterChain.doFilter(request, response);

    }
}
