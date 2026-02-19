package com.krishirent.equipment.exception;

public class ActiveBookingExistsException extends RuntimeException {

    public ActiveBookingExistsException(String message) {
        super(message);
    }
}
