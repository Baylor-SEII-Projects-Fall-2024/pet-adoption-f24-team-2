package petadoption.api.pet;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.dto.PetDto;
import petadoption.api.dto.SignUpDto;
import petadoption.api.dto.UserDto;
import petadoption.api.enums.Role;
import petadoption.api.exceptions.AppException;
import petadoption.api.mappers.PetMapper;
import petadoption.api.user.UserService;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("testdb")  // make these tests use the H2 in-memory DB instead of your actual DB
@Transactional             // make these tests revert their DB changes after the test is complete
public class PetTests {
    @Autowired
    private PetService petService;

    @Autowired
    private PetMapper petMapper;

    @Autowired
    private UserService userService;

    @Test
    void testPetCreate() {
        SignUpDto signUpDto = new SignUpDto();
        signUpDto.setEmailAddress("register@exmaple.com");
        signUpDto.setPassword("password".toCharArray());
        signUpDto.setRole(Role.ADOPTION_CENTER);

        UserDto user = userService.register(signUpDto);

        PetDto petDto = PetDto.builder()
                .name("Thor")
                .age(1)
                .breed("Mutt")
                .gender(true)
                .furLength(3)
                .species("Dog")
                .description("Skittish")
                .build();

        Pet pet = petMapper.toPet(petDto);
        PetDto savedPet = petMapper.toPetDto(petService.savePet(pet, user.getId()));

        assertEquals(savedPet.getAdoptionCenterID(), user.getId());
        assertEquals(savedPet.getName(), "Thor");
        assertEquals(savedPet.getAge(), 1);
        assertEquals(savedPet.getBreed(), "Mutt");
        assertEquals(savedPet.getFurLength(), 3);
        assertEquals(savedPet.getSpecies(), "Dog");
        assertEquals(savedPet.getDescription(), "Skittish");
    }

    @Test
    void testPetCreateNoAdoptionCenter() {
        Pet pet = new Pet();
        pet.setName("name");

        assertThrows(AppException.class, () -> petService.savePet(pet, 1L));
    }

    @Test
    void testNoPets() {
        assertEquals(new ArrayList<PetDto>(), petService.getPets(1L));
    }

    @Test
    void testGetPets() {
        List<PetDto> pets = new ArrayList<PetDto>();
        SignUpDto signUpDto = new SignUpDto();
        signUpDto.setEmailAddress("register@exmaple.com");
        signUpDto.setPassword("password".toCharArray());
        signUpDto.setRole(Role.ADOPTION_CENTER);

        UserDto user = userService.register(signUpDto);

        PetDto petDto = PetDto.builder()
                .name("Thor")
                .age(1)
                .breed("Mutt")
                .gender(true)
                .furLength(3)
                .species("Dog")
                .description("Skittish")
                .build();
        Pet pet = petMapper.toPet(petDto);

        PetDto savedPet = petMapper.toPetDto(petService.savePet(pet, user.getId()));
        System.out.println(pet);
        pets.add(savedPet);
        petDto.setName("Crazy");
        pet = petMapper.toPet(petDto);
        savedPet = petMapper.toPetDto(petService.savePet(pet, user.getId()));
        pets.add(savedPet);

        assertEquals(pets, petService.getPets(user.getId()));
    }

    @Test
    void testDeleteNotFound() {
        assertDoesNotThrow(() -> petService.deletePet(1L));
    }

    @Test
    void testDeleteSuccess() {
        SignUpDto signUpDto = new SignUpDto();
        signUpDto.setEmailAddress("register@exmaple.com");
        signUpDto.setPassword("password".toCharArray());
        signUpDto.setRole(Role.ADOPTION_CENTER);

        UserDto user = userService.register(signUpDto);

        PetDto petDto = PetDto.builder()
                .name("Thor")
                .age(1)
                .breed("Mutt")
                .gender(true)
                .furLength(3)
                .species("Dog")
                .description("Skittish")
                .build();
        Pet pet = petMapper.toPet(petDto);

        PetDto savedPet = petMapper.toPetDto(petService.savePet(pet, user.getId()));

        petService.deletePet(savedPet.getId());
        assertEquals(new ArrayList<>(), petService.getPets(user.getId()));
    }

    @Test
    void testPetUpdateSuccess() {
        SignUpDto signUpDto = new SignUpDto();
        signUpDto.setEmailAddress("register@exmaple.com");
        signUpDto.setPassword("password".toCharArray());
        signUpDto.setRole(Role.ADOPTION_CENTER);

        UserDto user = userService.register(signUpDto);

        PetDto petDto = PetDto.builder()
                .name("Thor")
                .age(1)
                .breed("Mutt")
                .gender(true)
                .furLength(3)
                .species("Dog")
                .description("Skittish")
                .build();
        Pet pet = petMapper.toPet(petDto);

        PetDto savedPet = petMapper.toPetDto(petService.savePet(pet, user.getId()));
        petDto.setAdoptionCenterID(savedPet.getAdoptionCenterID());
        petDto.setName("crazy");
        petDto.setAge(2);
        petDto.setId(savedPet.getId());
        pet = petMapper.toPet(petDto);
        savedPet = petMapper.toPetDto(petService.updatePet(pet, user.getId()));

        assertEquals(savedPet.getId(), petDto.getId());
        assertEquals(savedPet.getName(), pet.getName());
        assertEquals(user.getId(), savedPet.getAdoptionCenterID());
    }

    @Test
    void testEventUpdateInvalidPet() {
        SignUpDto signUpDto = new SignUpDto();
        signUpDto.setEmailAddress("register@exmaple.com");
        signUpDto.setPassword("password".toCharArray());
        signUpDto.setRole(Role.ADOPTION_CENTER);

        UserDto user = userService.register(signUpDto);

        Pet pet = new Pet();
        pet.setId(0L);
        pet.setName("Crazy");
        System.out.println(pet);

        assertThrows(AppException.class, () -> petService.updatePet(pet, user.getId()));
    }

    @Test
    void testEventUpdateInvalidCenter() {
        SignUpDto signUpDto = new SignUpDto();
        signUpDto.setEmailAddress("register@exmaple.com");
        signUpDto.setPassword("password".toCharArray());
        signUpDto.setRole(Role.ADOPTION_CENTER);

        UserDto user = userService.register(signUpDto);

        Pet pet = new Pet();
        pet.setName("Crazy");

        Pet savedPet = petService.savePet(pet, user.getId());
        pet.setName("Thor");
        pet.setId(savedPet.getId());
        assertThrows(AppException.class, () -> petService.updatePet(pet, 0L));
    }

}
