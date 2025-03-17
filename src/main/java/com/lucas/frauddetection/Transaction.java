package com.lucas.frauddetection;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Transaction implements Serializable {

    @JsonProperty("transactionId")
    private String transactionId;

    @JsonProperty("accountNumber")
    private String accountNumber;

    @JsonProperty("amount")
    private BigDecimal amount;

    @JsonProperty("currency")
    private String currency;

    @JsonProperty("timestamp")
    private LocalDateTime timestamp;
}
