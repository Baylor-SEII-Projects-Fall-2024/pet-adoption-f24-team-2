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
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

@Log4j2
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
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

    @PostMapping("/pets/interpretAttributes")
    public List<String> interpretAttributes(@RequestBody PetDto pet) {

        System.out.println("values:    " + pet.getSpecies() + pet.getColor() + pet.getGender() + pet.getAge());
        System.out.println("attributes:" + Arrays.toString(pet.getAttributes().getAttributes()));
        List<String> temp = new ArrayList<>();
        double[] attributes = pet.getAttributes().getAttributes();

        if (attributes != null) {
            if (attributes[0] == 1) {
                temp.add("Cat");
            } else if (attributes[1] == 1) {
                temp.add("Dog");
            } else if (attributes[2] == 1) {
                temp.add("Rabbit");
            } else {
                temp.add("species");
            }

            if (attributes[3] == 1) {
                temp.add("White");
            } else if (attributes[4] == 1) {
                temp.add("Black");
            } else if (attributes[5] == 1) {
                temp.add("Brown");
            } else {
                temp.add("color");
            }

            if (attributes[6] == 1) {
                temp.add("Male");
            } else if (attributes[7] == 1) {
                temp.add("Female");
            } else {
                temp.add("gender");
            }

            temp.add(String.valueOf(attributes[8]));
        }

        return temp;
    }
}
