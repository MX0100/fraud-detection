# Fraud Detection System

This project is a **fraud detection system** built using **Spring Boot** and **RabbitMQ**. It simulates receiving transaction data from a bank, sending the data to RabbitMQ for processing, and consuming the messages in a fraud detection service.

## 📋 Initial Plan
1. Simulate receiving transaction data via REST API (`POST /api/transaction`).
2. Send transactions to **RabbitMQ** as messages.
3. Process received messages in a consumer service.
4. Log received transactions (later, we can add fraud detection logic and database storage).

---

## 🚀 How to Run the Project

### 1️⃣ **Start RabbitMQ using Docker**
Make sure **Docker** is installed. Run the following command to start a **RabbitMQ container**:

```sh
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management

RabbitMQ Web UI: http://localhost:15672/
Username: guest | Password: guest
```
### 2️⃣ **Stop RabbitMQ using Docker**
```shell
docker stop rabbitmq
```
Restart RabbitMQ:
```shell
docker start rabbitmq
```
## 📡 API Endpoints

### 1️⃣ **Send Transaction (POST)**
URL:
```sh
POST http://localhost:8080/api/transaction
```
Eaxaple header:
```sh
Key          | Value
Content-Type | application/json
```
Example JSON Body:
```json
{
  "transactionId": "TX12345",
  "accountNumber": "ACC789",
  "amount": 1200.50,
  "currency": "USD",
  "timestamp": "2025-03-16T14:00:00"
}
```
### 2️⃣ **Check RabbitMQ Logs**
You can check messages received in the consumer:
```shell
docker logs -f rabbitmq
```
