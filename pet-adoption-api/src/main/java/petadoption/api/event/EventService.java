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
import java.util.Date;
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

    public EventDto update(Long centerID, EventDto newEvent) {
        Event e = eventRepository.findById(
                newEvent.getId()).orElseThrow(() -> new AppException("Event not found", HttpStatus.NOT_FOUND));
        User adoptionCenter = userRepository.findById(centerID)
                .orElseThrow(() -> new AppException("Adoption center not found", HttpStatus.NOT_FOUND));

        e.setDate(new Date(newEvent.getDate()));
        e.setName(newEvent.getName());
        e.setLocation(newEvent.getLocation());
        e.setDescription(newEvent.getDescription());
        e.setAdoptionCenter(adoptionCenter);

        return eventMapper.eventToEventDto(eventRepository.save(e));
    }
}
