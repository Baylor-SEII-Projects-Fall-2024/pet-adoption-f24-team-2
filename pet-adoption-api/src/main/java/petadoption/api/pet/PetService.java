package petadoption.api.pet;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import petadoption.api.dto.PetDto;
import petadoption.api.exceptions.AppException;
import petadoption.api.mappers.PetMapper;
import petadoption.api.notification.NotificationRepository;
import petadoption.api.user.User;
import petadoption.api.user.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PetService {
    private final PetRepository petRepository;
    private final PetMapper petMapper;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public PetDto savePet(PetDto petDto, Long adoptionCenterID) {
        // Fetch the adoption center (User) from the database
        Pet pet = petMapper.toPet(petDto);
        User adoptionCenter = userRepository.findById(adoptionCenterID)
                .orElseThrow(() -> new AppException("Adoption center not found", HttpStatus.NOT_FOUND));

        // Associate the adoption center with the pet
        pet.setAdoptionCenter(adoptionCenter);

        // Save the pet to the database
        return petMapper.toPetDto(petRepository.save(pet));
    }

    public List<PetDto> getPets(Long centerID) {
        List<PetDto> pets = new ArrayList<PetDto>();
        List<Pet> savedPets = petRepository.findAllByAdoptionCenterId(centerID);

        for (Pet pet : savedPets) {
            pets.add(petMapper.toPetDto(pet));
        }
        return pets;
    }

    public List<PetDto> getAllPets() {
        List<PetDto> pets = new ArrayList<PetDto>();
        List<Pet> savedPets = petRepository.findAll();

        for (Pet pet : savedPets) {
            pets.add(petMapper.toPetDto(pet));
        }
        return pets;
    }

    @Transactional
    public void deletePet(Long petID) {
        notificationRepository.deleteByPetId(petID);
        petRepository.deleteById(petID);
    }

    public PetDto updatePet(PetDto pet, Long centerID) {
        petRepository.findById(pet.getId()).orElseThrow(() -> new AppException("Pet not found", HttpStatus.NOT_FOUND));
        User adoptionCenter = userRepository.findById(centerID)
                .orElseThrow(() -> new AppException("Adoption center not found", HttpStatus.NOT_FOUND));
        Pet newPet = petMapper.toPet(pet);
        newPet.setAdoptionCenter(adoptionCenter);
        return petMapper.toPetDto(petRepository.save(newPet));
    }

    public PetDto getPet(Long petID) {
        Pet pet = petRepository.findById(petID)
                .orElseThrow(() -> new AppException("Pet not found", HttpStatus.NOT_FOUND));

        return petMapper.toPetDto(pet);
    }

    public void deleteAllPets() {
        petRepository.deleteAll();
    }
}
