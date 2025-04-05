package com.lucas.frauddetection;

import com.lucas.frauddetection.entity.Transaction;
import com.lucas.frauddetection.config.RabbitMQConfig;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionEngine {

    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public TransactionEngine(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendTransaction(Transaction transaction) {
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, RabbitMQConfig.ROUTING_KEY, transaction);
        System.out.println("Transaction sent to RabbitMQ: " + transaction);
    }
    /**
     * Sends a transaction message to RabbitMQ
     */
    public void sendTransactionBatch(List<Transaction> transactions) {
        for (Transaction transaction : transactions) {
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.EXCHANGE_NAME,
                    RabbitMQConfig.ROUTING_KEY,
                    transaction
            );
        }
        System.out.println("Batch of " + transactions.size() + " transactions sent to RabbitMQ.");
    }
}
