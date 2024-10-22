package petadoption.api.event;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.dto.EventDto;
import petadoption.api.dto.SignUpDto;
import petadoption.api.dto.UserDto;
import petadoption.api.enums.Role;
import petadoption.api.exceptions.AppException;
import petadoption.api.user.UserService;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("testdb")  // make these tests use the H2 in-memory DB instead of your actual DB
@Transactional             // make these tests revert their DB changes after the test is complete
public class EventTests {
    @Autowired
    private EventService eventService;
    @Autowired
    private UserService userService;

    @Test
    void testEventCreate() {
        SignUpDto signUpDto = new SignUpDto();
        signUpDto.setEmailAddress("register@exmaple.com");
        signUpDto.setPassword("password".toCharArray());
        signUpDto.setRole(Role.ADOPTION_CENTER);

        UserDto user = userService.register(signUpDto);

        EventDto eventDto = new EventDto();
        eventDto.setName("Adoption Event");

        EventDto savedEvent = eventService.save(eventDto, user.getId());

        assertEquals(savedEvent.getAdoptionCenterId(), user.getId());
        assertEquals(savedEvent.getName(), "Adoption Event");
    }

    @Test
    void testEventCreateNoAdoptionCenter() {
        EventDto eventDto = new EventDto();
        eventDto.setName("Adoption Event");

        assertThrows(AppException.class, () -> eventService.save(eventDto, 1L));
    }

    @Test
    void testNoEvents() {
        assertEquals(new ArrayList<EventDto>(), eventService.getEvents(1L));
    }

    @Test
    void testGetEvents() {
        List<EventDto> events = new ArrayList<EventDto>();
        SignUpDto signUpDto = new SignUpDto();
        signUpDto.setEmailAddress("register@exmaple.com");
        signUpDto.setPassword("password".toCharArray());
        signUpDto.setRole(Role.ADOPTION_CENTER);

        UserDto user = userService.register(signUpDto);

        EventDto eventDto = new EventDto();
        eventDto.setName("Adoption Event");

        EventDto savedEvent = eventService.save(eventDto, user.getId());
        events.add(savedEvent);
        eventDto.setName("Adoption Event2");
        savedEvent = eventService.save(eventDto, user.getId());
        events.add(savedEvent);

        assertEquals(events, eventService.getEvents(user.getId()));
    }

    @Test
    void testDeleteNotFound() {
        assertDoesNotThrow(() -> eventService.delete(1L));
    }

    @Test
    void testDeleteSuccess() {
        SignUpDto signUpDto = new SignUpDto();
        signUpDto.setEmailAddress("register@exmaple.com");
        signUpDto.setPassword("password".toCharArray());
        signUpDto.setRole(Role.ADOPTION_CENTER);

        UserDto user = userService.register(signUpDto);

        EventDto eventDto = new EventDto();
        eventDto.setName("Adoption Event");

        EventDto savedEvent = eventService.save(eventDto, user.getId());

        eventService.delete(savedEvent.getId());
        assertEquals(new ArrayList<>(), eventService.getEvents(user.getId()));
    }

    @Test
    void testEventUpdateSuccess() {
        SignUpDto signUpDto = new SignUpDto();
        signUpDto.setEmailAddress("register@exmaple.com");
        signUpDto.setPassword("password".toCharArray());
        signUpDto.setRole(Role.ADOPTION_CENTER);

        UserDto user = userService.register(signUpDto);

        EventDto eventDto = new EventDto();
        eventDto.setName("Adoption Event");

        EventDto savedEvent = eventService.save(eventDto, user.getId());
        eventDto.setName("Edited Adoption Event");
        eventDto.setId(savedEvent.getId());
        eventService.update(user.getId(), eventDto);
        EventDto event = eventService.getEvents(user.getId()).get(0);

        assertEquals(savedEvent.getId(), event.getId());
        assertEquals(eventDto.getName(), event.getName());
        assertEquals(user.getId(), event.getAdoptionCenterId());
    }

    @Test
    void testEventUpdateInvalidEvent() {
        SignUpDto signUpDto = new SignUpDto();
        signUpDto.setEmailAddress("register@exmaple.com");
        signUpDto.setPassword("password".toCharArray());
        signUpDto.setRole(Role.ADOPTION_CENTER);

        UserDto user = userService.register(signUpDto);

        EventDto eventDto = new EventDto();

        eventDto.setName("Edited Adoption Event");
        eventDto.setId(1L);
        assertThrows(AppException.class, () -> eventService.update(user.getId(), eventDto));
    }

    @Test
    void testEventUpdateInvalidCenter() {
        SignUpDto signUpDto = new SignUpDto();
        signUpDto.setEmailAddress("register@exmaple.com");
        signUpDto.setPassword("password".toCharArray());
        signUpDto.setRole(Role.ADOPTION_CENTER);

        UserDto user = userService.register(signUpDto);

        EventDto eventDto = new EventDto();
        eventDto.setName("Adoption Event");

        EventDto savedEvent = eventService.save(eventDto, user.getId());
        eventDto.setName("Edited Adoption Event");
        eventDto.setId(savedEvent.getId());
        assertThrows(AppException.class, () -> eventService.update(0L, eventDto));
    }

}
