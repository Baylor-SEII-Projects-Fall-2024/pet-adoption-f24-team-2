package petadoption.api.pet;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import petadoption.api.user.User;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PetService {
    private final PetRepository petRepository;

    public Optional<Pet> findUser(Long petId) {
        return petRepository.findById(petId);
    }

    public Pet saveUser(Pet pet) {
        return petRepository.save(pet);
    }
}
