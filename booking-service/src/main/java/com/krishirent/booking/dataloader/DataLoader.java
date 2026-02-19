package com.krishirent.booking.dataloader;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.krishirent.booking.repository.BookingRepository;

@Component
public class DataLoader implements CommandLineRunner {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(DataLoader.class);

    private final BookingRepository bookingRepository;

    public DataLoader(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Override
    public void run(String... args) {
        log.info("Booking DataLoader: Booking service ready. No sample bookings pre-loaded (bookings created via API).");
    }
}
