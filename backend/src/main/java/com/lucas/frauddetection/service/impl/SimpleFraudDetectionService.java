package com.lucas.frauddetection.service.impl;

import com.lucas.frauddetection.entity.Transaction;
import com.lucas.frauddetection.service.FraudDetectionService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class SimpleFraudDetectionService implements FraudDetectionService {

    // Set suspicious transaction amount threshold
    private static final BigDecimal SUSPICIOUS_AMOUNT_THRESHOLD = new BigDecimal("5000.00");
    
    // Set high risk transaction amount threshold (for increased suspicion, not direct fraud detection)
    private static final BigDecimal HIGH_RISK_THRESHOLD = new BigDecimal("100000.00");

    @Override
    public boolean analyzeTransaction(Transaction transaction) {
        // Set default values
        transaction.setIsFraudulent(false); // Default not fraudulent, this value can only be set by manual review
        transaction.setIsSuspicious(false);
        
        // TODO: Implement more complex fraud detection algorithms
        // You can add machine learning models, rule engines, or other advanced fraud detection technologies here
        
        // Check transaction amount
        if (transaction.getAmount().compareTo(HIGH_RISK_THRESHOLD) >= 0) {
            // Very large amount, mark as highly suspicious but not automatically fraudulent
            System.out.println("High risk transaction detected: Amount exceeds high risk threshold " + HIGH_RISK_THRESHOLD);
            transaction.setIsSuspicious(true);
            return true; // Return as highly suspicious
        } else if (transaction.getAmount().compareTo(SUSPICIOUS_AMOUNT_THRESHOLD) >= 0) {
            // Large amount, mark as suspicious
            System.out.println("Suspicious transaction detected: Amount exceeds suspicious threshold " + SUSPICIOUS_AMOUNT_THRESHOLD);
            transaction.setIsSuspicious(true);
            return true; // Return as suspicious
        }
        
        // TODO: Add more detection rules here
        // For example: check account history, geographic anomalies, transaction frequency, transaction patterns, etc.
        
        return false; // Return as not suspicious
    }
}
