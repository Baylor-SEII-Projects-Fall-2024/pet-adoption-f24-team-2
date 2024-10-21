package petadoption.api.event;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import petadoption.api.dto.EventDto;
import petadoption.api.dto.PetDto;
import petadoption.api.exceptions.AppException;
import petadoption.api.mappers.EventMapper;
import petadoption.api.user.User;
import petadoption.api.user.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EventMapper eventMapper;

    public EventDto save(EventDto newEvent, Long adoptionCenterID) {
        User adoptionCenter = userRepository.findById(adoptionCenterID)
                .orElseThrow(() -> new AppException("Adoption center not found", HttpStatus.NOT_FOUND));

        Event e = eventMapper.eventDtoToEvent(newEvent);
        e.setAdoptionCenter(adoptionCenter);
        e = eventRepository.save(e);
        return eventMapper.eventToEventDto(e);
    }

    public List<EventDto> getEvents(Long centerID) {
        List<EventDto> events = new ArrayList<EventDto>();

        List<Event> savedEvents = eventRepository.findAllByAdoptionCenterId(centerID);

        for( Event e : savedEvents) {
            events.add(eventMapper.eventToEventDto(e));
        }

        return events;
    }

    public void delete(Long eventID) {
        eventRepository.deleteById(eventID);
    }

    public void update(Long eventID, EventDto newEvent) {

    }
}
