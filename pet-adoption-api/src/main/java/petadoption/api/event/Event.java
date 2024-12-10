package petadoption.api.event;

import jakarta.persistence.*;
import lombok.Data;
import petadoption.api.user.User;

import java.util.Date;

@Data
@Entity
@Table(name = Event.TABLE_NAME)
public class Event {
    public static final String TABLE_NAME = "EVENTS";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "EVENT_ID")
    Long id;

    @Column(name = "NAME")
    String name;

    @Column(name = "DESCRIPTION")
    String description;

    @Column(name = "DATE")
    Date date;

    @Column(name = "STREET_ADDRESS")
    String streetAddress;

    @Column(name = "CITY")
    String city;

    @Column(name = "STATE")
    String state;

    @ManyToOne
    @JoinColumn(name = "ADOPTION_CENTER_ID")
    User adoptionCenter;
}
