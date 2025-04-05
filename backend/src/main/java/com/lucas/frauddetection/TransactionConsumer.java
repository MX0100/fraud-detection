package com.lucas.frauddetection;

import com.lucas.frauddetection.entity.Transaction;
import com.lucas.frauddetection.config.RabbitMQConfig;
import com.lucas.frauddetection.mapper.TransactionMapper;
import com.lucas.frauddetection.service.FraudDetectionService;
import org.springframework.amqp.AmqpRejectAndDontRequeueException;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class TransactionConsumer {

    @Autowired
    private TransactionMapper transactionMapper;
    
    @Autowired
    private FraudDetectionService fraudDetectionService;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME, concurrency = "5")
    public void receiveTransaction(Transaction transaction) {
        try {
            // Validate transaction data
            if (transaction == null || 
                transaction.getTransactionId() == null || 
                transaction.getAccountNumber() == null || 
                transaction.getAmount() == null) {
                
                System.out.println("WARNING: Received invalid transaction data, ignored");
                // Discard this message, don't requeue
                throw new AmqpRejectAndDontRequeueException("Invalid transaction data");
            }
            
            System.out.println("Received Transaction: " + transaction);
            System.out.println("Account Number: " + transaction.getAccountNumber());
            System.out.println("Amount: " + transaction.getAmount());
            System.out.println("Currency: " + transaction.getCurrency());
            System.out.println("Timestamp: " + transaction.getTimestamp());
            
            // If timestamp is null, don't process
            if (transaction.getTimestamp() == null) {
                System.out.println("WARNING: Transaction missing timestamp, ignored: " + transaction.getTransactionId());
                throw new AmqpRejectAndDontRequeueException("Transaction missing timestamp");
            }
            
            // If currency is null or empty, don't process
            if (transaction.getCurrency() == null || transaction.getCurrency().trim().isEmpty()) {
                System.out.println("WARNING: Transaction missing currency, ignored: " + transaction.getTransactionId());
                throw new AmqpRejectAndDontRequeueException("Transaction missing currency");
            }
            
            // Suspicious transaction detection logic
            boolean isSuspicious = fraudDetectionService.analyzeTransaction(transaction);
            
            // Log detection results
            if (isSuspicious) {
                System.out.println("ALERT: Suspicious transaction detected! " + transaction.getTransactionId());
                // TODO: Add suspicious transaction handling logic here
                // For example: add to review queue, notify risk department, etc.
            }

            try {
                transactionMapper.insertTransaction(transaction);
                System.out.println("Transaction saved successfully: " + transaction.getTransactionId() 
                        + " (Suspicious: " + transaction.getIsSuspicious() + ")");
            } catch (DuplicateKeyException e) {
                System.out.println("Transaction already exists, skipping: " + transaction.getTransactionId());
                // Add duplicate transaction handling logic here, such as update instead of insert
            }
        } catch (AmqpRejectAndDontRequeueException e) {
            // Throw directly, no retry
            throw e;
        } catch (Exception e) {
            // Other unexpected exceptions, log and don't retry
            System.out.println("Error processing transaction: " + e.getMessage());
            throw new AmqpRejectAndDontRequeueException("Error processing transaction", e);
        }
    }
}
