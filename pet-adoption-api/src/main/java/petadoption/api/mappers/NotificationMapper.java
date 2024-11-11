package petadoption.api.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;
import petadoption.api.dto.NotificationDto;
import petadoption.api.notification.Notification;
import petadoption.api.pet.Pet;
import petadoption.api.user.User;

import java.util.Date;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface NotificationMapper {
    @Mapping(target = "user", expression = "java(mapUserIdToUser(notificationDto.getUserId()))")
    @Mapping(target = "pet", expression = "java(mapPetIdToPet(notificationDto.getPetId()))")
    Notification notificatioDtoToNotification(NotificationDto notificationDto);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "pet.id", target = "petId")
    NotificationDto notificationToNotificationDto(Notification notification);

    default User mapUserIdToUser(Long userId) {
        if(userId == null) {
            return null;
        }
        User user = new User();
        user.setId(userId);
        return user;
    }

    default Pet mapPetIdToPet(Long petId) {
        if(petId == null) {
            return null;
        }
        Pet pet = new Pet();
        pet.setId(petId);
        return pet;
    }

    default Date mapLongToDate(Long value) {
        return value != null ? new Date(value) : null; // Handle null values appropriately
    }

    default Long mapDateToLong(Date value) {
        return value != null ? value.getTime() : null; // Handle null values
    }
}
