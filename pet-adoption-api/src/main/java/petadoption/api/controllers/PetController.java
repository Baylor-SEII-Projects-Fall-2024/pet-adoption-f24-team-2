package petadoption.api.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;
import petadoption.api.dto.PetDto;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetService;

import java.util.List;

@Log4j2
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PetController {
    private final PetService petService;

    @PostMapping("/pets/{centerID}")
    public PetDto addPet(@PathVariable Long centerID, @RequestBody Pet pet) {
        return petService.savePet(pet, centerID);
    }

    @GetMapping("/pets/{centerID}")
    public List<Pet> getPets(@PathVariable Long centerID) {
        return petService.getPets(centerID);
    }
}
