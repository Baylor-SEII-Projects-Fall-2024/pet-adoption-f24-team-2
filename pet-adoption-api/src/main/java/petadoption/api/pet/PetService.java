package petadoption.api.pet;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import petadoption.api.dto.PetDto;
import petadoption.api.exceptions.AppException;
import petadoption.api.mappers.PetMapper;
import petadoption.api.user.User;
import petadoption.api.user.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PetService {
    private final PetRepository petRepository;
    private final PetMapper petMapper;
    private final UserRepository userRepository;

    public Pet savePet(Pet pet, Long adoptionCenterID) {
        // Fetch the adoption center (User) from the database
        User adoptionCenter = userRepository.findById(adoptionCenterID)
                .orElseThrow(() -> new AppException("Adoption center not found", HttpStatus.NOT_FOUND));

        // Associate the adoption center with the pet
        pet.setAdoptionCenter(adoptionCenter);

        // Save the pet to the database
        return petRepository.save(pet);
    }

    public List<PetDto> getPets(Long centerID) {
        List<PetDto> pets = new ArrayList<PetDto>();
        List<Pet> savedPets = petRepository.findAllByAdoptionCenterId(centerID);

        for( Pet pet : savedPets) {
            pets.add(petMapper.toPetDto(pet));
        }
        return pets;
    }

    public void deletePet(Long petID) {
        petRepository.deleteById(petID);
    }

    public Pet updatePet(Pet pet, Long centerID) {
        petRepository.findById(pet.getId()).orElseThrow(() -> new AppException("Pet not found", HttpStatus.NOT_FOUND));
        User adoptionCenter = userRepository.findById(centerID)
                .orElseThrow(() -> new AppException("Adoption center not found", HttpStatus.NOT_FOUND));

        pet.setAdoptionCenter(adoptionCenter);
        return petRepository.save(pet);
    }
}
