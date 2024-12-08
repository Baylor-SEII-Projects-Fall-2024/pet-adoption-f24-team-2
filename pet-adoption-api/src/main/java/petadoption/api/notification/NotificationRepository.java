package petadoption.api.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import petadoption.api.dto.NotificationDto;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    void deleteByPetId(Long petID);

    List<Notification> findByPetAdoptionCenterId(Long userID);
}
