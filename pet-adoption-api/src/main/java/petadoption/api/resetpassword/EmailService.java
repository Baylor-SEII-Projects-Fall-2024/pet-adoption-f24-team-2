package petadoption.api.resetpassword;

import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;
import jakarta.mail.internet.MimeMessage;
import petadoption.api.exceptions.AppException;
import petadoption.api.user.UserService;

@Service
@AllArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;

    private final UserService userService;

    public void sendResetEmail(String recipient, String resetLink) {
        boolean userExists = userService.checkUserExists(recipient);
        System.out.println("Here 3");

        if(!userExists) {
            throw new AppException("Email address not found.", HttpStatus.NOT_FOUND);
        }
        System.out.println("Here 4");
        String subject = "Password Reset Request";
        String body = ("You requested to reset your password. Please click the following" +
                "link to continue:\n" + resetLink);

        System.out.println("Here 5");
        sendEmail(recipient, subject, body);
    }

    private void sendEmail(String recipient, String subject, String body) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            System.out.println("Here 6");

            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(body);
            System.out.println("Here 7");

            javaMailSender.send(message);
            System.out.println("Here 8");
        } catch (MessagingException e) {
            throw new AppException("Failed to send email. Please try again later", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (MailException e) {
            System.out.println(e);
            throw new AppException("Invalid email format or unknown error.", HttpStatus.BAD_REQUEST);
        }
    }
}
