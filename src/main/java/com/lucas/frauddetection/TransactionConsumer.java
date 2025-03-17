package com.lucas.frauddetection;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class TransactionConsumer {

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME, concurrency = "10")
    public void receiveTransaction(Transaction transaction) {
        System.out.println("Received Transaction: " + transaction);
        System.out.println("Account Number: " + transaction.getAccountNumber());
        System.out.println("Amount: " + transaction.getAmount());
        System.out.println("Currency: " + transaction.getCurrency());
        System.out.println("Timestamp: " + transaction.getTimestamp());
        // TODO: Add Fraud detection logic
    }
}
