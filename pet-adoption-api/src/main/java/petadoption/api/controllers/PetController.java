package petadoption.api.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.dto.PetDto;
import petadoption.api.mappers.PetMapper;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetService;
import petadoption.api.recommendation.petAttributes;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Log4j2
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://104.198.233.250:3000")
public class PetController {
    private final PetService petService;
    private final PetMapper petMapper;

    @PostMapping("/pets/{centerID}")
    public PetDto addPet(@PathVariable Long centerID, @RequestBody Pet pet) {
        petAttributes attributes = new petAttributes(pet.getSpecies(),
                pet.getColor(), pet.getGender(), pet.getAge());

        pet.setAttributes(attributes);
        return petMapper.toPetDto(petService.savePet(pet, centerID));
    }

    @DeleteMapping("/pets/{petID}")
    public ResponseEntity<Void> removePet(@PathVariable Long petID) {
        try {
            petService.deletePet(petID);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/pets/{centerID}")
    public List<PetDto> getPets(@PathVariable Long centerID) {
        return petService.getPets(centerID);
    }

    @GetMapping("/pet/{petID}")
    public PetDto getPet(@PathVariable Long petID) {
        return petService.getPet(petID);
    }

    @GetMapping("/pets/all")
    public List<PetDto> getAllPets() {
        return petService.getAllPets();
    }

    @PutMapping("/pets/{centerID}")
    public ResponseEntity<PetDto> updatePet(@RequestBody PetDto pet, @PathVariable Long centerID) {
        Pet newPet = petMapper.toPet(pet);
        newPet = petService.updatePet(newPet, centerID);
        pet = petMapper.toPetDto(newPet);

        return ResponseEntity.ok(pet);
    }

    @PostMapping("/pets/addTestPets/{id}")
    public void addTestPets(@PathVariable Long id) {
        List<PetDto> pets = new ArrayList<>();
        String[] speciesOptions = {"cat", "dog", "rabbit"};
        String[] colorOptions = {"white", "black", "brown"};

        for (int i = 0; i < 50; i++) {
            Pet pet = new Pet();
            pet.setName("testPet" + i);

            // Random species
            String randomSpecies = speciesOptions[ThreadLocalRandom.current().nextInt(speciesOptions.length)];
            pet.setSpecies(randomSpecies);

            // Random color
            String randomColor = colorOptions[ThreadLocalRandom.current().nextInt(colorOptions.length)];
            pet.setColor(randomColor);

            pet.setBreed("testbreed");
            pet.setDescription("Randomly generated test pet.");
            pet.setFurLength(0);

            // Random age between 1 and 15
            int randomAge = ThreadLocalRandom.current().nextInt(1, 16);
            pet.setAge(randomAge);

            // Random gender (true or false)
            boolean randomGender = ThreadLocalRandom.current().nextBoolean();
            pet.setGender(randomGender);

            petAttributes attributes = new petAttributes(randomSpecies, randomColor, randomGender, randomAge);
            pet.setAttributes(attributes);

            pet.setAdoptionCenter(null);

            addPet(id, pet);
        }
    }
}
