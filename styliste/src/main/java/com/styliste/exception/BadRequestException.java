/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.exception.BadRequestException
 */
package com.styliste.exception;

public class BadRequestException
extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }

    public BadRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}

