package petadoption.api.enums;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {
    PET_OWNER,
    ADOPTION_CENTER;

    @Override
    public String getAuthority() {
        return this.name();
    }
}
