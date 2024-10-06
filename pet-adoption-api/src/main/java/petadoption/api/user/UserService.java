package petadoption.api.user;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import petadoption.api.dto.CredentialsDto;
import petadoption.api.dto.SignUpDto;
import petadoption.api.dto.UserDto;
import petadoption.api.exceptions.AppException;
import petadoption.api.mappers.UserMapper;

import java.nio.CharBuffer;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserDto findUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));

        return userMapper.toUserDto(user);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public UserDto login(CredentialsDto credentialsDto) {
        User user = userRepository.findByEmailAddress(credentialsDto.getEmailAddress())
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));

        if(passwordEncoder.matches(CharBuffer.wrap(credentialsDto.getPassword()), user.getPassword() )) {
            System.out.println(user);
            return userMapper.toUserDto(user);
        }

        throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
    }

    public UserDto findByEmail(String email) {
        User user = userRepository.findByEmailAddress(email)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
        return userMapper.toUserDto(user);

    }

    public UserDto register(SignUpDto registration) {
        Optional<User> optionalUser = userRepository.findByEmailAddress(registration.getEmailAddress());

        if( optionalUser.isPresent() ) {
            throw new AppException("Email already exists", HttpStatus.BAD_REQUEST);
        }

        User user = userMapper.signUpToUser(registration);
        // Mapping ignores the password, so add the hashed password
        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(registration.getPassword())));

        User savedUser = userRepository.save(user);


        return userMapper.toUserDto(user);
    }

    public UserDto updateUser(Long id, UserDto user) {
        user.setId(id);
        User newUser = userMapper.userDtoToUser(user);
        User savedUser = userRepository.save(newUser);

        return userMapper.toUserDto(savedUser);
    }
}
