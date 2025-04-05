package com.lucas.frauddetection.service;

import com.lucas.frauddetection.entity.Transaction;

public interface FraudDetectionService {
    
    /**
     * Analyzes a transaction and detects if it's suspicious
     *
     * @param transaction The transaction to analyze
     * @return true if the transaction is detected as suspicious, false otherwise
     */
    boolean analyzeTransaction(Transaction transaction);
} 