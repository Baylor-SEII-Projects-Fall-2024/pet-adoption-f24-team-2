package petadoption.api.notification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByIsReadFalseAndPetAdoptionCenterId(Long adoptionCenterId);
    void deleteByPetId(Long petID);
}