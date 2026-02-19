package com.krishirent.payment.dataloader;

import com.krishirent.payment.repository.PaymentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(DataLoader.class);

    private final PaymentRepository paymentRepository;

    public DataLoader(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public void run(String... args) {
        log.info("Payment DataLoader: Payment service ready. No sample payments pre-loaded (payments created via API).");
    }
}
