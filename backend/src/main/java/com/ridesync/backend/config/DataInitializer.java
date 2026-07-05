package com.ridesync.backend.config;

import com.ridesync.backend.entity.Role;
import com.ridesync.backend.entity.User;
import com.ridesync.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String ADMIN_EMAIL    = "admin@ridesync.com";
    private static final String ADMIN_PASSWORD = "Admin@RideSync2024";
    private static final String ADMIN_NAME     = "RideSync Admin";

    @Override
    public void run(String... args) {
        // Only create admin if it doesn't already exist
        if (userRepository.findByEmail(ADMIN_EMAIL).isEmpty()) {
            User admin = User.builder()
                    .name(ADMIN_NAME)
                    .email(ADMIN_EMAIL)
                    .password(passwordEncoder.encode(ADMIN_PASSWORD))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("✅ Admin account created: {}", ADMIN_EMAIL);
        } else {
            log.info("ℹ️  Admin account already exists, skipping seed.");
        }
    }
}
