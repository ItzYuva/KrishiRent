package com.krishirent.user.dataloader;

import com.krishirent.user.entity.Role;
import com.krishirent.user.entity.User;
import com.krishirent.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(DataLoader.class);

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            userRepository.save(User.builder()
                    .fullName("Ravi Kumar")
                    .email("ravi@krishirent.com")
                    .password(passwordEncoder.encode("farmer123"))
                    .phone("9876543210")
                    .role(Role.FARMER)
                    .district("Thane")
                    .build());

            userRepository.save(User.builder()
                    .fullName("Priya Singh")
                    .email("priya@krishirent.com")
                    .password(passwordEncoder.encode("farmer123"))
                    .phone("9876543211")
                    .role(Role.FARMER)
                    .district("Pune")
                    .build());

            userRepository.save(User.builder()
                    .fullName("Suresh Patil")
                    .email("suresh@krishirent.com")
                    .password(passwordEncoder.encode("owner123"))
                    .phone("9876543212")
                    .role(Role.OWNER)
                    .district("Thane")
                    .build());

            userRepository.save(User.builder()
                    .fullName("Meena Joshi")
                    .email("meena@krishirent.com")
                    .password(passwordEncoder.encode("owner123"))
                    .phone("9876543213")
                    .role(Role.OWNER)
                    .district("Pune")
                    .build());

            userRepository.save(User.builder()
                    .fullName("Admin User")
                    .email("admin@krishirent.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("9876543214")
                    .role(Role.ADMIN)
                    .district("Mumbai")
                    .build());

            log.info("User DataLoader: 5 sample users loaded successfully");
        }
    }
}
