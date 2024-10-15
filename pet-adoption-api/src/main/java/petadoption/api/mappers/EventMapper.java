package petadoption.api.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;
import petadoption.api.dto.EventDto;
import petadoption.api.event.Event;
import petadoption.api.user.User;

import java.util.Date;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface EventMapper {

    @Mapping(target = "adoptionCenter", expression = "java(mapAdoptionCenterIdToUser(eventDto.getAdoptionCenterId()))")
    Event eventDtoToEvent(EventDto eventDto);

    @Mapping(source = "adoptionCenter.id", target = "adoptionCenterId")
    EventDto eventToEventDto(Event event);

    default User mapAdoptionCenterIdToUser(Long adoptionCenterID) {
        if(adoptionCenterID == null) {
            return null;
        }
        User user = new User();
        user.setId(adoptionCenterID);
        return user;
    }

    default Date mapLongToDate(Long value) {
        return value != null ? new Date(value) : null; // Handle null values appropriately
    }

    default Long mapDateToLong(Date value) {
        return value != null ? value.getTime() : null; // Handle null values
    }
}
