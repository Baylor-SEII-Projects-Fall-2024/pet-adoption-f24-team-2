package petadoption.api.pet;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import petadoption.api.dto.PetDto;
import petadoption.api.exceptions.AppException;
import petadoption.api.mappers.PetMapper;
import petadoption.api.user.User;
import petadoption.api.user.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PetService {
    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final PetMapper petMapper;

    public PetDto savePet(Pet pet, Long adoptionCenterID) {
        // Fetch the adoption center (User) from the database
        User adoptionCenter = userRepository.findById(adoptionCenterID)
                .orElseThrow(() -> new AppException("Adoption center not found", HttpStatus.NOT_FOUND));

        // Associate the adoption center with the pet
        pet.setAdoptionCenter(adoptionCenter);

        // Save the pet to the database
        return petMapper.toPetDto(petRepository.save(pet));
    }

    public List<Pet> getPets(Long centerID) {
        return petRepository.findAllByAdoptionCenterId(centerID);
    }
}
