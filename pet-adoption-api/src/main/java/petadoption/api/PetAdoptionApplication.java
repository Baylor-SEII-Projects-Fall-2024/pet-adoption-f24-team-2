package petadoption.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class PetAdoptionApplication {
    public static void main(String[] args) {

		File dotenvFile = new File(".env");

		if (dotenvFile.exists()) {
			Dotenv dotenv = Dotenv.load();
			System.setProperty("SPRING_DATASOURCE_URL", dotenv.get("SPRING_DATASOURCE_URL"));
			System.setProperty("SPRING_DATASOURCE_USERNAME", dotenv.get("SPRING_DATASOURCE_USERNAME"));
			System.setProperty("SPRING_DATASOURCE_PASSWORD", dotenv.get("SPRING_DATASOURCE_PASSWORD"));
		}

        SpringApplication.run(PetAdoptionApplication.class, args);
    }
}