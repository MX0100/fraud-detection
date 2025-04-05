package com.lucas.frauddetection.mapper;

import com.lucas.frauddetection.entity.Transaction;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TransactionMapper {
    void insertTransaction(@Param("transaction") Transaction transaction);
    
    // Keep all suspicious transactions
    List<Transaction> findSuspiciousTransactions();
    
    // Update status
    void updateFraudStatus(@Param("transactionId") String transactionId, 
                           @Param("isFraudulent") Boolean isFraudulent);
}
