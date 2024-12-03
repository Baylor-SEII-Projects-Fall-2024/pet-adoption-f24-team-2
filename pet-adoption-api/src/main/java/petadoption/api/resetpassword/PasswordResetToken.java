package petadoption.api.resetpassword;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import petadoption.api.user.User;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private LocalDateTime expirationTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userID", nullable = false)
    private User user;

    public PasswordResetToken(String token, LocalDateTime expirationTime, User user) {
        this.token = token;
        this.expirationTime = expirationTime;
        this.user = user;
    }

}
