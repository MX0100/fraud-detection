package com.lucas.frauddetection;

import com.lucas.frauddetection.entity.Transaction;
import com.lucas.frauddetection.mapper.TransactionMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:8000", "http://localhost:8080"}, 
             allowedHeaders = "*", 
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class TransactionController {

    private final TransactionEngine transactionEngine;
    
    @Autowired
    private TransactionMapper transactionMapper;

    @Autowired
    public TransactionController(TransactionEngine transactionEngine) {
        this.transactionEngine = transactionEngine;
    }

    @PostMapping("/transaction")
    public ResponseEntity<Map<String, Object>> sendTransaction(@RequestBody Transaction transaction) {
        try {
            // Validate transaction
            if (transaction.getTransactionId() == null || transaction.getAccountNumber() == null || 
                transaction.getAmount() == null || transaction.getCurrency() == null || 
                transaction.getTimestamp() == null) {
                
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("status", "error");
                errorResponse.put("message", "Invalid transaction data. All fields are required.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            transactionEngine.sendTransaction(transaction);
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Transaction processing started");
            response.put("transactionId", transaction.getTransactionId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Failed to process transaction: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/transactions/batch")
    public ResponseEntity<Map<String, Object>> sendTransactionBatch(@RequestBody List<Transaction> transactions) {
        try {
            // Validate batch is not empty
            if (transactions == null || transactions.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("status", "error");
                errorResponse.put("message", "Transaction batch cannot be empty");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            transactionEngine.sendTransactionBatch(transactions);
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Batch processing started");
            response.put("count", transactions.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Failed to process transaction batch: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Get all suspicious transactions for manual review
     */
    @GetMapping("/suspicious-transactions")
    public ResponseEntity<Object> getSuspiciousTransactions() {
        try {
            List<Transaction> suspiciousTransactions = transactionMapper.findSuspiciousTransactions();
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("count", suspiciousTransactions.size());
            response.put("transactions", suspiciousTransactions);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Failed to retrieve suspicious transactions: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Manual review to confirm if a transaction is fraudulent
     * This operation should only be performed by users with review permissions
     */
    @PutMapping("/transaction/{transactionId}/manual-review")
    public ResponseEntity<Map<String, Object>> updateFraudStatus(
            @PathVariable String transactionId,
            @RequestBody Map<String, Boolean> status) {
        
        try {
            Boolean isFraudulent = status.get("isFraudulent");
            if (isFraudulent == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("status", "error");
                errorResponse.put("message", "Invalid request: 'isFraudulent' field is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            transactionMapper.updateFraudStatus(transactionId, isFraudulent);
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("transactionId", transactionId);
            
            if (isFraudulent) {
                response.put("message", "Transaction has been confirmed as fraudulent by manual review");
            } else {
                response.put("message", "Transaction has been confirmed as legitimate by manual review");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Failed to update fraud status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
