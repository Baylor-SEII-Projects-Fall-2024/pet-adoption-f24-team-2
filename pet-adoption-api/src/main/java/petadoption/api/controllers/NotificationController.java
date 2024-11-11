package petadoption.api.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.dto.NotificationDto;
import petadoption.api.notification.NotificationService;

import java.util.List;

@Log4j2
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {
    private final NotificationService notificationService;

    @PostMapping("/notifications")
    public ResponseEntity<NotificationDto> createNotification(@RequestBody NotificationDto notificationDto) {
        System.out.println(notificationDto);
        NotificationDto notificationDto1 = notificationService.save(notificationDto);
        return ResponseEntity.ok(notificationDto1);
    }

    @GetMapping("/notifications/{adoptionCenterId}")
    public ResponseEntity<List<NotificationDto>> getUnreadNotifications(@PathVariable Long adoptionCenterId) {
        List<NotificationDto> notifications = notificationService.getUnreadNotifications(adoptionCenterId);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/notifications/read/{notificationId}")
    public ResponseEntity<NotificationDto> setNotificationRead(@PathVariable Long notificationId) {
        NotificationDto notification = notificationService.markAsRead(notificationId);
        System.out.println(notification);
        return ResponseEntity.ok(notification);
    }
}
