package petadoption.api.controllers;

import jakarta.validation.Valid;
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
@CrossOrigin(origins = "${FRONTEND_URL}")
public class NotificationController {
    private final NotificationService notificationService;

    @PostMapping("/notifications")
    public ResponseEntity<NotificationDto> createNotification(@RequestBody @Valid NotificationDto notificationDto) {
        System.out.println(notificationDto);
        NotificationDto notificationDto1 = notificationService.save(notificationDto);
        return ResponseEntity.ok(notificationDto1);
    }

    @GetMapping("/notifications/{userID}")
    public ResponseEntity<List<NotificationDto>> getUnreadNotifications(@PathVariable Long userID) {
        List<NotificationDto> notifications = notificationService.getAllNotifications(userID);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/notifications/read/{notificationId}")
    public ResponseEntity<NotificationDto> setNotificationRead(@PathVariable Long notificationId) {
        NotificationDto notification = notificationService.markAsRead(notificationId);
        System.out.println(notification);
        return ResponseEntity.ok(notification);
    }
}
