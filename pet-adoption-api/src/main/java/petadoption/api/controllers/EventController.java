package petadoption.api.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.dto.EventDto;
import petadoption.api.event.EventService;

import java.util.List;

@Log4j2
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {
    private final EventService eventService;

    @PostMapping("/register/{centerID}")
    public EventDto registerEvent(@PathVariable Long centerID, @RequestBody EventDto newEvent) {
        EventDto savedEvent = eventService.save(newEvent, centerID);

        return savedEvent;
    }

    @GetMapping("/events/{centerID}")
    public List<EventDto> getEvents(@PathVariable Long centerID) {
        return eventService.getEvents(centerID);
    }

    @DeleteMapping("/events/{eventID}")
    public ResponseEntity<Void> remove(@PathVariable Long eventID) {
        try {
            eventService.delete(eventID);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/events/{eventID}")
    public ResponseEntity<EventDto> update(@PathVariable Long eventID, @RequestBody EventDto newEvent) {
        eventService.update(eventID, newEvent);
    }
}
