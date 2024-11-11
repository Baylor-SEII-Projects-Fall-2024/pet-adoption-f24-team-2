package petadoption.api.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.config.UserAuthProvider;
import petadoption.api.dto.CredentialsDto;
import petadoption.api.dto.PetDto;
import petadoption.api.dto.SignUpDto;
import petadoption.api.dto.UserDto;
import petadoption.api.mappers.*;
import petadoption.api.pet.PetService;
import petadoption.api.recommendation.PetRecommendation;
import petadoption.api.recommendation.petAttributes;
import petadoption.api.user.User;
import petadoption.api.user.UserService;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http:/localhost:3000")
public class UserController {

    private final PetRecommendation petRecommendation;
    private final UserService userService;
    private final PetService petService;
    private final UserAuthProvider userAuthProvider;
    private final UserMapper userMapper;
    private final PetMapper petMapper;

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

    @GetMapping("/users/adoption-centers")
    public ResponseEntity<List<UserDto>> showCenters() {
        return ResponseEntity.ok(userService.getAdoptionCenters());
    }

    @GetMapping("/users/adoption-centers/{id}")
    public ResponseEntity<UserDto> showSpecifiedCenter(@PathVariable long id) {
        UserDto adoptionCenter = userService.getSpecifiedAdoptionCenter(id);
        if (adoptionCenter != null) {
            return ResponseEntity.ok(adoptionCenter);
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }
}
