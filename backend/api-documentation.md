# Fraud Detection API Documentation

This document describes the API endpoints available in the Fraud Detection system. All endpoints return JSON responses with a standardized format.

## Base URL

```
http://localhost:8080/api
```

## Authentication

Authentication is not implemented in the current version. In a production environment, you would need to implement proper authentication and authorization.

## Standard Response Format

All API responses follow a standard format:

### Success Response

```json
{
  "status": "success",
  "message": "Operation completed successfully"
  // Additional data specific to the endpoint
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error description"
}
```

## API Endpoints

### 1. Submit a Transaction

Submit a single transaction for fraud detection analysis.

**Endpoint:** `POST /transaction`

**Request Body:**

```json
{
  "transactionId": "TX-12345",
  "accountNumber": "123456789",
  "amount": 1000.5,
  "currency": "USD",
  "timestamp": "2023-04-05T12:00:00"
}
```

| Field         | Type   | Required | Description                                    |
| ------------- | ------ | -------- | ---------------------------------------------- |
| transactionId | String | Yes      | Unique identifier for the transaction          |
| accountNumber | String | Yes      | Account number associated with the transaction |
| amount        | Number | Yes      | Transaction amount                             |
| currency      | String | Yes      | Transaction currency code (e.g., USD, EUR)     |
| timestamp     | String | Yes      | Transaction datetime in ISO 8601 format        |

**Success Response (200 OK):**

```json
{
  "status": "success",
  "message": "Transaction processing started",
  "transactionId": "TX-12345"
}
```

**Error Response (400 Bad Request):**

```json
{
  "status": "error",
  "message": "Invalid transaction data. All fields are required."
}
```

### 2. Submit a Transaction Batch

Submit multiple transactions in a batch for fraud detection analysis.

**Endpoint:** `POST /transactions/batch`

**Request Body:**

```json
[
  {
    "transactionId": "TX-12345",
    "accountNumber": "123456789",
    "amount": 1000.5,
    "currency": "USD",
    "timestamp": "2023-04-05T12:00:00"
  },
  {
    "transactionId": "TX-12346",
    "accountNumber": "987654321",
    "amount": 5500.75,
    "currency": "EUR",
    "timestamp": "2023-04-05T12:30:00"
  }
]
```

**Success Response (200 OK):**

```json
{
  "status": "success",
  "message": "Batch processing started",
  "count": 2
}
```

**Error Response (400 Bad Request):**

```json
{
  "status": "error",
  "message": "Transaction batch cannot be empty"
}
```

### 3. Get Suspicious Transactions

Retrieve a list of transactions that have been flagged as suspicious by the system for manual review.

**Endpoint:** `GET /suspicious-transactions`

**Success Response (200 OK):**

```json
{
  "status": "success",
  "count": 2,
  "transactions": [
    {
      "transactionId": "TX-12345",
      "accountNumber": "123456789",
      "amount": 6000.5,
      "currency": "USD",
      "timestamp": "2023-04-05T12:00:00",
      "isFraudulent": false,
      "isSuspicious": true
    },
    {
      "transactionId": "TX-12346",
      "accountNumber": "987654321",
      "amount": 150000.75,
      "currency": "EUR",
      "timestamp": "2023-04-05T12:30:00",
      "isFraudulent": false,
      "isSuspicious": true
    }
  ]
}
```

### 4. Update Fraud Status (Manual Review)

Update a transaction's fraud status after manual review.

**Endpoint:** `PUT /transaction/{transactionId}/manual-review`

**Path Parameters:**

| Parameter     | Description                     |
| ------------- | ------------------------------- |
| transactionId | ID of the transaction to update |

**Request Body:**

```json
{
  "isFraudulent": true
}
```

| Field        | Type    | Required | Description                                                        |
| ------------ | ------- | -------- | ------------------------------------------------------------------ |
| isFraudulent | Boolean | Yes      | Whether the transaction is fraudulent (true) or legitimate (false) |

**Success Response (200 OK):**

```json
{
  "status": "success",
  "transactionId": "TX-12345",
  "message": "Transaction has been confirmed as fraudulent by manual review"
}
```

**Error Response (400 Bad Request):**

```json
{
  "status": "error",
  "message": "Invalid request: 'isFraudulent' field is required"
}
```

## Error Codes

| HTTP Status Code          | Description              |
| ------------------------- | ------------------------ |
| 200 OK                    | Request successful       |
| 400 Bad Request           | Invalid input parameters |
| 404 Not Found             | Resource not found       |
| 500 Internal Server Error | Server-side error        |

## Integration Guidelines for Frontend

### Recommended Integration Flow

1. **Submit Transactions**: Send transactions to the backend using the `/transaction` or `/transactions/batch` endpoints
2. **Retrieve Suspicious Transactions**: Periodically poll the `/suspicious-transactions` endpoint to get transactions requiring review
3. **Review and Update**: After manual review, update the transaction status using the `/transaction/{transactionId}/manual-review` endpoint

### Example: Submitting a Transaction

```javascript
// Example using fetch API
async function submitTransaction(transactionData) {
  try {
    const response = await fetch("http://localhost:8080/api/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    });

    const data = await response.json();

    if (data.status === "success") {
      console.log("Transaction submitted successfully:", data.transactionId);
      return data;
    } else {
      console.error("Error submitting transaction:", data.message);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Network error:", error);
    throw error;
  }
}
```

### Example: Displaying Suspicious Transactions

```javascript
// Example using fetch API
async function getSuspiciousTransactions() {
  try {
    const response = await fetch(
      "http://localhost:8080/api/suspicious-transactions"
    );
    const data = await response.json();

    if (data.status === "success") {
      console.log(`Found ${data.count} suspicious transactions`);
      return data.transactions;
    } else {
      console.error("Error retrieving suspicious transactions:", data.message);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Network error:", error);
    throw error;
  }
}
```

### Example: Updating Transaction Status After Review

```javascript
// Example using fetch API
async function updateTransactionStatus(transactionId, isFraudulent) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/transaction/${transactionId}/manual-review`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isFraudulent }),
      }
    );

    const data = await response.json();

    if (data.status === "success") {
      console.log("Transaction status updated:", data.message);
      return data;
    } else {
      console.error("Error updating transaction status:", data.message);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Network error:", error);
    throw error;
  }
}
```
