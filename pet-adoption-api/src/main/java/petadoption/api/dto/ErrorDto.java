package petadoption.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

@AllArgsConstructor
@RequiredArgsConstructor
@Builder
@Data
public class ErrorDto {
    private String message;
    private List<String> messages;

    public ErrorDto(String message) {
        this.message = message;
    }
}
