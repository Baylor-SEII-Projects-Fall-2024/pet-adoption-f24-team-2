package petadoption.api.mappers;

import org.mapstruct.Mapper;
import petadoption.api.dto.PetDto;
import petadoption.api.pet.Pet;

@Mapper(componentModel = "spring")
public interface PetMapper {
    PetDto toPetDto(Pet pet);
}
