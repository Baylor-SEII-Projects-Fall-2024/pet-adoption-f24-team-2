package petadoption.api.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import petadoption.api.dto.SignUpDto;
import petadoption.api.dto.UserDto;
import petadoption.api.user.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toUserDto(User user);

    @Mapping(target= "password", ignore = true)
    User signUpToUser(SignUpDto registration);
}
