package petadoption.api.notification;

import jakarta.persistence.*;
import lombok.Data;
import petadoption.api.pet.Pet;
import petadoption.api.user.User;

import java.util.Date;

@Data
@Entity
@Table(name = Notification.TABLE_NAME)
public class Notification {
    public static final String TABLE_NAME = "NOTIFICATIONS";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "NOTIFICATION_ID")
    Long id;

    @ManyToOne
    @JoinColumn(name = "USER_ID")
    User user;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "PET_ID")
    Pet pet;

    @Column
    String message;

    @Column
    boolean isRead;

    @Column
    Date createdAt;
}
