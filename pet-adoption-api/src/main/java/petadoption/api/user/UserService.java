package petadoption.api.user;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import petadoption.api.dto.CredentialsDto;
import petadoption.api.dto.PetDto;
import petadoption.api.dto.SignUpDto;
import petadoption.api.dto.UserDto;
import petadoption.api.enums.Role;
import petadoption.api.exceptions.AppException;
import petadoption.api.mappers.UserMapper;
import petadoption.api.recommendation.petAttributes;
import petadoption.api.resetpassword.PasswordResetToken;
import petadoption.api.resetpassword.PasswordResetTokenRepository;

import java.nio.CharBuffer;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserDto findUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));

        return userMapper.toUserDto(user);
    }

    public User findAUser(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
        return user;
    }

    public UserDto saveUser(User user) {
        return userMapper.toUserDto(userRepository.save(user));
    }

    public UserDto login(CredentialsDto credentialsDto) {
        User user = userRepository.findByEmailAddress(credentialsDto.getEmailAddress())
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));

        if(passwordEncoder.matches(CharBuffer.wrap(credentialsDto.getPassword()), user.getPassword() )) {
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
        Optional<User> optionalUser = userRepository.findById(id);
        if( optionalUser.isEmpty() ) {
            throw new AppException("Account not found", HttpStatus.BAD_REQUEST);
        }

        User currUser = optionalUser.get();
        user.setId(id);
        User newUser = userMapper.userDtoToUser(user);
        newUser.setAttributes(new petAttributes(currUser.getAttributes()));
        newUser.setPassword(currUser.getPassword());
        User savedUser = userRepository.save(newUser);

        return userMapper.toUserDto(savedUser);
    }

    public List<UserDto> getAdoptionCenters() {
        List<User> adoptionCenters = userRepository.findByRole(Role.ADOPTION_CENTER);
        List<UserDto> adoptionCenterDto = adoptionCenters.stream()
                .map(userMapper::toUserDto)
                .collect(Collectors.toList());
        return adoptionCenterDto;
    }

    public UserDto getSpecifiedAdoptionCenter(Long id) {
        return userRepository.findByIdAndRole(id, Role.ADOPTION_CENTER)
                .map(userMapper::toUserDto)
                .orElse(null);
    }

    public void addLikedPet(User u, PetDto p) {
        u.getAttributes().combine(p.getAttributes());
        u.incrementNumLikedPets();
        userRepository.save(u);
    }

    public UserDto resetUserPreferences(Long id, UserDto user) {
        Optional<User> optionalUser = userRepository.findById(id);
        if( optionalUser.isEmpty() ) {
            throw new AppException("Account not found", HttpStatus.BAD_REQUEST);
        }

        User currUser = optionalUser.get();
        user.setId(id);
        User newUser = userMapper.userDtoToUser(user);
        newUser.resetPreferences();
        newUser.setPassword(currUser.getPassword());
        User savedUser = userRepository.save(newUser);

        return userMapper.toUserDto(savedUser);
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new AppException("Invalid or expired token", HttpStatus.BAD_REQUEST));

        if (resetToken.getExpirationTime().isBefore(LocalDateTime.now())) {
            throw new AppException("Token expired", HttpStatus.BAD_REQUEST);
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }

    public String generateResetToken(String email) {
        User user = userRepository.findByEmailAddress(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        tokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(
                token,
                LocalDateTime.now().plusHours(1),
                user
        );

        tokenRepository.save(resetToken);
        return token;
    }

    public boolean checkUserExists(String email) {
        return userRepository.findByEmailAddress(email).isPresent();
    }
}
