package petadoption.api.user;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.dto.CredentialsDto;
import petadoption.api.dto.SignUpDto;
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

        UserDto savedUser = userService.saveUser(newUser);
        assertNotNull(savedUser.getId());

        assertEquals(newUser.role, savedUser.getRole());
        assertEquals(newUser.emailAddress, savedUser.getEmailAddress());
    }

    @Test
    void testUserFind() {
        assertThrows(AppException.class , () -> userService.findUser(1L));
    }

    @Test
    void testUserFindSuccess() {
        User newUser = new User();
        newUser.role = Role.PET_OWNER;
        newUser.emailAddress = "example2@example.com";
        newUser.password = "password";

        userService.saveUser(newUser);
        UserDto savedUser = userService.findUser(newUser.getId());
        assertNotNull(savedUser.getId());

        assertEquals(newUser.role, savedUser.getRole());
        assertEquals(newUser.emailAddress, savedUser.getEmailAddress());
    }

    @Test
    void testUserRegister() {
        SignUpDto signUpDto = new SignUpDto();
        signUpDto.setEmailAddress("register@exmaple.com");
        signUpDto.setPassword("password".toCharArray());
        signUpDto.setRole(Role.ADOPTION_CENTER);

        UserDto user = userService.register(signUpDto);
        assertEquals(signUpDto.getEmailAddress(), user.getEmailAddress());
        assertEquals(signUpDto.getRole(), user.getRole());
    }

    @Test
    void testUserRegisterDuplicateEmail() {
        SignUpDto signUpDto = new SignUpDto();
        signUpDto.setEmailAddress("register1@exmaple.com");
        signUpDto.setPassword("password".toCharArray());
        signUpDto.setRole(Role.ADOPTION_CENTER);

        userService.register(signUpDto);
        assertThrows(AppException.class, () -> userService.register(signUpDto));
    }

    @Test
    void testUserLogin() {
        SignUpDto signUpDto = new SignUpDto();
        signUpDto.setEmailAddress("register2@exmaple.com");
        signUpDto.setPassword("password".toCharArray());
        signUpDto.setRole(Role.PET_OWNER);
        CredentialsDto credentialsDto =
                new CredentialsDto("register2@exmaple.com", "password".toCharArray());

        userService.register(signUpDto);
        UserDto user = userService.login(credentialsDto);

        assertEquals(user.getRole(), signUpDto.getRole());
        assertEquals(user.getEmailAddress(), signUpDto.getEmailAddress());
    }

    @Test
    void testUserLoginNotFound() {
        CredentialsDto credentialsDto =
                new CredentialsDto("register3@example.com", "password".toCharArray());

        assertThrows(AppException.class,() -> userService.login(credentialsDto));
    }

    @Test
    void testUserLoginIncorrectPassword() {
        SignUpDto signUpDto = new SignUpDto();
        signUpDto.setEmailAddress("register4@example.com");
        signUpDto.setPassword("password".toCharArray());
        signUpDto.setRole(Role.PET_OWNER);
        CredentialsDto credentialsDto =
                new CredentialsDto("register4@example.com", "wrong".toCharArray());

        userService.register(signUpDto);

        assertThrows(AppException.class, () -> userService.login(credentialsDto));
    }

    @Test
    void testEmailNotFound() {
        assertThrows(AppException.class, () -> userService.findByEmail("random@example.com"));
    }

    @Test
    void updateUser() {
        SignUpDto signUpDto = new SignUpDto();
        signUpDto.setEmailAddress("update@example.com");
        signUpDto.setPassword("password".toCharArray());
        signUpDto.setRole(Role.PET_OWNER);

        UserDto user = userService.register(signUpDto);
        user.setName("John Doe");
        user.setPhone("888-888-8888");

        UserDto updatedUser = userService.updateUser(user.getId(), user);

        assertEquals(updatedUser.getName(), "John Doe");
        assertEquals(updatedUser.getEmailAddress(), "update@example.com");
        assertEquals(updatedUser.getRole(), Role.PET_OWNER);
        assertEquals(updatedUser.getPhone(), "888-888-8888");
        assertEquals(updatedUser.getId(), user.getId());
    }
}
