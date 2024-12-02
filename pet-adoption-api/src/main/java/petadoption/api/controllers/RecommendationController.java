package petadoption.api.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;
import petadoption.api.dto.PetDto;
import petadoption.api.dto.UserDto;
import petadoption.api.mappers.PetMapper;
import petadoption.api.mappers.UserMapper;
import petadoption.api.pet.PetService;
import petadoption.api.recommendation.PetRecommendation;
import petadoption.api.recommendation.petAttributes;
import petadoption.api.user.User;
import petadoption.api.user.UserService;

import java.util.List;

@Log4j2
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "${FRONTEND_URL}")
public class RecommendationController {

    private final UserService userService;
    private final PetService petService;
    private final UserMapper userMapper;
    private final PetMapper petMapper;

    @GetMapping("/petrec/{id}/all")
    public List<PetDto> getRecommendedPets(@PathVariable Long id) {
        UserDto udto = userService.findUser(id);
        User u = userMapper.userDtoToUser(udto);

        double[] userProfile = u.generateUserProfile();

        List<PetDto> allPets = petService.getAllPets();
        return allPets.stream().sorted((pet1, pet2) -> Double.compare(
                PetRecommendation.calcPetSimilarity(u, petMapper.toPet(pet2)),
                PetRecommendation.calcPetSimilarity(u, petMapper.toPet(pet1)))).toList();
    }

    @PostMapping("/petrec/{id}/incSpecies/{species}")
    public void incSpeciesPref(@PathVariable Long id, @PathVariable String species) {
        UserDto udto = userService.findUser(id);
        User u = userMapper.userDtoToUser(udto);

        u.getAttributes().incrementSpecies(species);

        userService.updateUser(u.getId(), userMapper.toUserDto(u));
    }

    @PostMapping("/petrec/{id}/decSpecies/{species}")
    public void decSpeciesPref(@PathVariable Long id, @PathVariable String species) {
        UserDto udto = userService.findUser(id);
        User u = userMapper.userDtoToUser(udto);

        u.getAttributes().decrementSpecies(species);

        userService.updateUser(u.getId(), userMapper.toUserDto(u));
    }

    @PostMapping("/petrec/{id}/incColor/{color}")
    public void incColorPref(@PathVariable Long id, @PathVariable String color) {
        UserDto udto = userService.findUser(id);
        User u = userMapper.userDtoToUser(udto);

        u.getAttributes().incrementColor(color);

        userService.updateUser(u.getId(), userMapper.toUserDto(u));
    }

    @PostMapping("/petrec/{id}/decColor/{color}")
    public void decColorPref(@PathVariable Long id, @PathVariable String color) {
        UserDto udto = userService.findUser(id);
        User u = userMapper.userDtoToUser(udto);

        u.getAttributes().decrementColor(color);

        userService.updateUser(u.getId(), userMapper.toUserDto(u));
    }

    @PostMapping("/petrec/{id}/changeGender/{gender}")
    public void changeGenderPref(@PathVariable Long id, @PathVariable boolean gender) {
        UserDto udto = userService.findUser(id);
        User u = userMapper.userDtoToUser(udto);

        u.getAttributes().changeGender(gender);

        userService.updateUser(u.getId(), userMapper.toUserDto(u));
    }

    @PostMapping("/petrec/{id}/changeAge/{opt}")
    public void changeAgePref(@PathVariable Long id, @PathVariable boolean opt) {
        UserDto udto = userService.findUser(id);
        User u = userMapper.userDtoToUser(udto);

        u.getAttributes().changeAge(opt);

        userService.updateUser(u.getId(), userMapper.toUserDto(u));
    }

    @PostMapping("/petrec/{id}/reset")
    public void resetUserPreferences(@PathVariable Long id) {
        UserDto udto = userService.findUser(id);
        userService.resetUserPreferences(id, udto);
    }

    @PostMapping("/petrec/{id}/likePet")
    public void likePet(@PathVariable Long id, @RequestBody petAttributes attributes) {
        UserDto udto = userService.findUser(id);
        User u = userMapper.userDtoToUser(udto);

        u.addLikedPet(attributes);

        userService.updateUser(u.getId(), userMapper.toUserDto(u));
    }

    @PostMapping("/petrec/{id}/incBreed/{breed}")
    public void incBreedPref(@PathVariable Long id, @PathVariable String breed) {
        UserDto udto = userService.findUser(id);
        User u = userMapper.userDtoToUser(udto);

        u.getAttributes().incrementBreed(breed);

        userService.updateUser(u.getId(), userMapper.toUserDto(u));
    }

    @PostMapping("/petrec/{id}/decBreed/{breed}")
    public void decBreedPref(@PathVariable Long id, @PathVariable String breed) {
        UserDto udto = userService.findUser(id);
        User u = userMapper.userDtoToUser(udto);

        u.getAttributes().decrementBreed(breed);

        userService.updateUser(u.getId(), userMapper.toUserDto(u));
    }
}
