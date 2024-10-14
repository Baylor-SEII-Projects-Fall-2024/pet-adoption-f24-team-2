package petadoption.api.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.dto.PetDto;
import petadoption.api.mappers.PetMapper;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetService;

import java.util.List;

@Log4j2
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PetController {
    private final PetService petService;
    private final PetMapper petMapper;

    @PostMapping("/pets/{centerID}")
    public Pet addPet(@PathVariable Long centerID, @RequestBody Pet pet) {
        return petService.savePet(pet, centerID);
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
    public List<Pet> getPets(@PathVariable Long centerID) {
        return petService.getPets(centerID);
    }

    @PutMapping("/pets/{centerID}")
    public ResponseEntity<Pet> updatePet(@RequestBody PetDto pet, @PathVariable Long centerID) {
        System.out.println(pet);
        Pet newPet = petMapper.toPet(pet);
        newPet = petService.updatePet(newPet, centerID);

        return ResponseEntity.ok(newPet);
    }
}