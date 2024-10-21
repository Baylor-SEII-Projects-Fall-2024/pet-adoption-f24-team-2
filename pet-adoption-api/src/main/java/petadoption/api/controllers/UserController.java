package petadoption.api.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.config.UserAuthProvider;
import petadoption.api.dto.CredentialsDto;
import petadoption.api.dto.SignUpDto;
import petadoption.api.dto.UserDto;
import petadoption.api.user.User;
import petadoption.api.user.UserService;

import java.net.URI;

@Log4j2
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://104.198.233.250:3000")
public class UserController {
    private final UserService userService;
    private final UserAuthProvider userAuthProvider;

    @GetMapping("/users/{id}")
    public UserDto findByID(@PathVariable Long id) {
        return userService.findUser(id);
    }

    @PutMapping("/users/{id}")
    public UserDto updateUser(@PathVariable Long id, @RequestBody UserDto user) {
        return userService.updateUser(id, user);
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody CredentialsDto credentialsDto) {
        UserDto user = userService.login(credentialsDto);

        // Provide a fresh JWT token on login
        user.setToken(userAuthProvider.createToken(user));
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody SignUpDto signUpDto) {
        UserDto user = userService.register(signUpDto);
        // Return a fresh JWT token on registration
        user.setToken(userAuthProvider.createToken(user));

        // Return 201 Created code and the URL to find the created entity
        return ResponseEntity.created(URI.create("/users/" + user.getId()))
                .body(user);
    }

    @PostMapping("/users")
    public UserDto saveUser(@RequestBody User user) {
        return userService.saveUser(user);
    }
}
