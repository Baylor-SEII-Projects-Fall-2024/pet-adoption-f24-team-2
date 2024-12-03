package petadoption.api.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import petadoption.api.config.UserAuthProvider;
import petadoption.api.dto.CredentialsDto;
import petadoption.api.dto.SignUpDto;
import petadoption.api.dto.UserDto;
import petadoption.api.resetpassword.EmailService;
import petadoption.api.user.CustomUserDetails;
import petadoption.api.user.UserService;

import java.net.URI;
import java.util.List;
import java.util.Map;

@Log4j2
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "${FRONTEND_URL}")
public class UserController {
    // TODO: Refactor to use @AuthenticationPrincipal for userDetails instead of id
    private final UserService userService;
    private final UserAuthProvider userAuthProvider;
    private final UserDetailsService userDetailsService;
    private final EmailService emailService;

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    @GetMapping("/users/{id}")
    public UserDto findByID(@PathVariable Long id) {
        return userService.findUser(id);
    }

    @PutMapping("/users/{id}")
    public UserDto updateUser(@AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid UserDto user) {
        Long id = userDetails.getUser().getId();
        return userService.updateUser(id, user);
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody CredentialsDto credentialsDto) {
        UserDto user = userService.login(credentialsDto);

        // Provide a fresh JWT token on login
        CustomUserDetails userDetails = (CustomUserDetails) userDetailsService
                .loadUserByUsername(user.getEmailAddress());
        String token = userAuthProvider.createToken(userDetails);
        user.setToken(token);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody @Valid SignUpDto signUpDto) {
        UserDto user = userService.register(signUpDto);
        // Return a fresh JWT token on registration
        CustomUserDetails userDetails = (CustomUserDetails) userDetailsService
                .loadUserByUsername(user.getEmailAddress());
        String token = userAuthProvider.createToken(userDetails);
        user.setToken(token);

        // Return 201 Created code and the URL to find the created entity
        return ResponseEntity.created(URI.create("/users/" + user.getId()))
                .body(user);
    }

    @GetMapping("/users/adoption-centers")
    public ResponseEntity<List<UserDto>> showCenters() {
        return ResponseEntity.ok(userService.getAdoptionCenters());
    }

    @GetMapping("/users/adoption-centers/{id}")
    public ResponseEntity<UserDto> showSpecifiedCenter(@PathVariable long id) {
        UserDto adoptionCenter = userService.getSpecifiedAdoptionCenter(id);
        if (adoptionCenter != null) {
            return ResponseEntity.ok(adoptionCenter);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        System.out.println("Here 1");
        String email = request.get("email");
        String token = userService.generateResetToken(email);

        String resetLink = frontendUrl + "/ResetPasswordPage?token=" + token;
        System.out.println("Here 2");
        emailService.sendResetEmail(email, resetLink);
        System.out.println("Here Last");


        return ResponseEntity.ok("Password reset Link sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("password");

        userService.resetPassword(token, newPassword);

        return ResponseEntity.ok("Password reset successful.");
    }

}
