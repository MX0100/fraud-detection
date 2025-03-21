package com.lucas.frauddetection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api")
public class TransactionController {

    private final TransactionEngine transactionEngine;

    @Autowired
    public TransactionController(TransactionEngine transactionEngine) {
        this.transactionEngine = transactionEngine;
    }

    @PostMapping("/transaction")
    public String sendTransaction(@RequestBody Transaction transaction) {
        transactionEngine.sendTransaction(transaction);
        return "Transaction sent to RabbitMQ!";
    }

    @PostMapping("/transactions/batch")
    public String sendTransactionBatch(@RequestBody List<Transaction> transactions) {
        transactionEngine.sendTransactionBatch(transactions);
        return "Batch of " + transactions.size() + " transactions sent.";
    }
}
