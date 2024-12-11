package petadoption.api.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import petadoption.api.dto.NotificationDto;
import petadoption.api.enums.Role;
import petadoption.api.exceptions.AppException;
import petadoption.api.mappers.NotificationMapper;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetRepository;
import petadoption.api.user.User;
import petadoption.api.user.UserRepository;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    public NotificationDto save(NotificationDto notificationDto) {
        User user = userRepository.findByIdAndRole(notificationDto.getUserId(), Role.PET_OWNER)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        Pet pet = petRepository.findById(notificationDto.getPetId())
                .orElseThrow(() -> new AppException("Pet not found", HttpStatus.NOT_FOUND));
        Notification notification = notificationMapper.notificatioDtoToNotification(notificationDto);
        notification.setPet(pet);
        notification.setUser(user);
        Notification saved = notificationRepository.save(notification);

        return notificationMapper.notificationToNotificationDto(saved);
    }

    public List<NotificationDto> getAllNotifications(Long userID) {
        List<Notification> notifications = notificationRepository.findByPetAdoptionCenterId(userID);

        return notifications.stream().map(notificationMapper::notificationToNotificationDto).toList();
    }

    public NotificationDto markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new AppException("Notification not found", HttpStatus.NOT_FOUND));
        notification.setRead(true);
        return notificationMapper.notificationToNotificationDto(notificationRepository.save(notification));
    }
}
