package petadoption.api.resetpassword;

import org.springframework.data.jpa.repository.JpaRepository;
import petadoption.api.user.User;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);

    void deleteByUser(User user);
}
