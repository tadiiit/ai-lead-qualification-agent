package com.myapp.aileadqualificationagent;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@ConfigurationPropertiesScan
@SpringBootApplication
public class AiLeadQualificationAgentApplication {

    public static void main(String[] args) {
        String key = System.getenv("GEMINI_API_KEY");

        System.out.println(
                key == null
                        ? "GEMINI_API_KEY = NOT SET"
                        : "GEMINI_API_KEY = SET"
        );
        SpringApplication.run(AiLeadQualificationAgentApplication.class, args);
    }

}
