package petadoption.api.user;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.dto.UserDto;
import petadoption.api.enums.Role;
import petadoption.api.exceptions.AppException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("testdb")  // make these tests use the H2 in-memory DB instead of your actual DB
@Transactional             // make these tests revert their DB changes after the test is complete
public class UserTests {
    @Autowired
    private UserService userService;

    @Test
    void testUserCreate() {
        User newUser = new User();
        newUser.role = Role.PET_OWNER;
        newUser.emailAddress = "example@example.com";
        newUser.password = "password";

        User savedUser = userService.saveUser(newUser);
        assertNotNull(savedUser.id);

        UserDto foundUser = userService.findUser(savedUser.id);

        assertEquals(newUser.role, foundUser.getRole());
        assertEquals(newUser.emailAddress, foundUser.getEmailAddress());
    }

    @Test
    void testUserFind() {
        assertThrows(AppException.class , () -> userService.findUser(1L));
    }
}
