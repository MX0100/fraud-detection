# ACH Fraud Detection System - API Documentation

## Overview

This document outlines the API endpoints for the ACH Fraud Detection System. The backend server runs on `http://localhost:8080` by default.

## API Endpoints

### 1. Transaction API

#### Get Transaction / Submit Transaction
- **URL**: `http://localhost:8080/api/transaction`
- **Methods**: `GET`, `POST`
- **Description**: Retrieves or submits transaction data
- **GET Parameters**:
  - `id`: (optional) Filter by transaction ID
- **POST Request Body**:
  ```json
  {
    "transactionId": "TX-20230415-123456",
    "routingNumber": "123456789",
    "accountNumber": "987654321",
    "amount": 1000.00,
    "individualName": "John Smith",
    "traceNumber": "ABC123456789",
    "timestamp": "2023-04-15T10:30:00Z",
    "currency": "USD"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "transactionId": "TX-20230415-123456",
      "routingNumber": "123456789",
      "accountNumber": "987654321",
      "amount": 1000.00,
      "individualName": "John Smith",
      "traceNumber": "ABC123456789",
      "timestamp": "2023-04-15T10:30:00Z",
      "currency": "USD"
    }
  }
  ```

### 2. Batch Transaction API

#### Submit Multiple Transactions
- **URL**: `http://localhost:8080/api/transactions/batch`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Description**: Submits multiple transactions for processing at once
- **Request Body**:
  ```json
  [
    {
      "transactionId": "TX-20230415-123456",
      "routingNumber": "123456789",
      "accountNumber": "987654321",
      "amount": 1000.00,
      "individualName": "John Smith",
      "traceNumber": "ABC123456789",
      "timestamp": "2023-04-15T10:30:00Z",
      "currency": "USD"
    },
    {
      "transactionId": "TX-20230415-654321",
      "routingNumber": "123456789",
      "accountNumber": "987654321",
      "amount": 2000.00,
      "individualName": "Jane Doe",
      "traceNumber": "DEF987654321",
      "timestamp": "2023-04-15T11:30:00Z",
      "currency": "USD"
    }
  ]
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Successfully processed 2 transactions",
    "data": {
      "processedCount": 2
    }
  }
  ```

### 3. Suspicious Transactions API

#### Get Suspicious Transactions
- **URL**: `http://localhost:8080/api/suspicious-transactions`
- **Method**: `GET`
- **Description**: Retrieves a list of transactions flagged as suspicious
- **Query Parameters**:
  - `id`: (optional) Filter by transaction ID
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "suspicion-123",
        "transactionId": "TX-20230415-123456",
        "routingNumber": "123456789",
        "accountNumber": "987654321",
        "amount": 5000.00,
        "individualName": "John Smith",
        "traceNumber": "ABC123456789",
        "riskScore": 85,
        "fraudIndicators": [
          "Unusual amount for customer",
          "Frequency threshold exceeded"
        ],
        "timestamp": "2023-04-15T10:30:00Z"
      }
    ]
  }
  ```

### 4. Manual Review API

#### Submit Manual Review
- **URL**: `http://localhost:8080/api/transaction/{transactionId}/manual-review`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Description**: Submits a manual review decision for a suspicious transaction
- **URL Parameters**:
  - `transactionId`: Unique transaction identifier
- **Request Body**:
  ```json
  {
    "isAccepted": true,
    "reviewNote": "Transaction verified"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Manual review submitted successfully",
    "data": {
      "transactionId": "TX-20230415-123456",
      "reviewStatus": "APPROVED"
    }
  }
  ```

## Error Responses

All endpoints may return the following error responses:

### Bad Request
- **Status Code**: 400
- **Response Body**:
  ```json
  {
    "success": false,
    "message": "Invalid request parameters",
    "errors": ["Field 'amount' must be a positive number"]
  }
  ```

### Not Found
- **Status Code**: 404
- **Response Body**:
  ```json
  {
    "success": false,
    "message": "Transaction not found"
  }
  ```

### Server Error
- **Status Code**: 500
- **Response Body**:
  ```json
  {
    "success": false,
    "message": "An error occurred while processing the request"
  }
  ```

## Required Fields

### Transaction Object
- `transactionId` (String): **Required**. Unique identifier for the transaction.
- `routingNumber` (String): **Required**. Bank routing number.
- `accountNumber` (String): **Required**. Account number.
- `amount` (Number): **Required**. Transaction amount.
- `individualName` (String): **Required**. Name of the individual.
- `traceNumber` (String): **Required**. Trace number for the transaction.
- `timestamp` (String): Creation timestamp in ISO 8601 format.
- `currency` (String): Currency code (default: USD).

## Notes
- All API responses include a `success` boolean indicating whether the request was successful
- All timestamps should be in ISO 8601 format (e.g., `2023-04-15T10:30:00Z`)
- All monetary amounts should be provided as decimal numbers (e.g., `1000.00` for $1,000)
- The `transactionId` field is required for all transactions and must be unique