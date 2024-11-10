package petadoption.api.mappers;

import org.mapstruct.*;
import petadoption.api.dto.PetDto;
import petadoption.api.pet.Pet;
import petadoption.api.user.User;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface PetMapper {

    @Mapping(source = "adoptionCenter.id", target = "adoptionCenterID")
    @Mapping(source = "owner.id", target = "ownerID")
    @Mapping(source = "attributes", target = "attributes") // Explicitly map attributes
    PetDto toPetDto(Pet pet);

    @Mapping(target = "adoptionCenter", expression = "java(mapAdoptionCenterIdToUser(petDto.getAdoptionCenterID()))")
    @Mapping(target = "owner", expression = "java(mapOwnerIdToUser(petDto.getOwnerID()))")
    @Mapping(source = "attributes", target = "attributes") // Explicitly map attributes
    Pet toPet(PetDto petDto);

    default User mapAdoptionCenterIdToUser(Long adoptionCenterID) {
        if(adoptionCenterID == null) {
            return null;
        }
        User user = new User();
        user.setId(adoptionCenterID);
        return user;
    }

    default User mapOwnerIdToUser(Long ownerID) {
        if(ownerID == null) {
            return null;
        }
        User user = new User();
        user.setId(ownerID);
        return user;// Assuming a constructor that takes ID
    }
}