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
## Transaction Flow Diagram

![Transaction Flow](https://www.plantuml.com/plantuml/png/VLDDRzf04BtlhnZbb1mGzqYqQI3jfQW5qbkaQ6mFCD9wxUu7AQdwtpiiQ_26E3VR-zwRjs-Uxvn7wqEj5PQ-iJ3LJCQhLZvooIqQ3rUF5esJOsxCj37UDbgJlG9qS7uTP3oO3HkAwEDZZbnYKR2VBo9WllXei0jr6jkzvEYl5aCr8q-Hi2Axu_8uE9wa3uCJvjYsP9_CzGmz5kZe9d9dzoaPqPVRagbWIJkcb-IbUr5gCadfmIeKDNi7FNMOJ5Gw7NtgvGQtyFF7wX76sFBOz_2DlVZcnWNwSljaNjXleG-knB8wYyg85BR8Ex7SCtBTuzr4qzqAO4xEuOPW4IZGmN3I43KvlGL9a57pAm6QAkfc9dm3zAVSejdGYVdshalomHee6xDcM-E1fvI82wvRgg1cf7adJtKo9ChhmmgVgswxpxyF7gFz4--BGRr_fSlO4q26P4sGGNYa3CQJmKUvINQhu5ekkGdkirAeVJQO7RZJkO8pCrVvtcnwk7wUIl9LcVdP_M6iSMJzXmkTemceKpEXsCEfkP96rzUB6dvxI2qysndrovVrAvcHfjZzW7-d139GW04AQ7O-coFqPBX7ZcqVkiZ0_pJ-ozM_SHsJ6Tb8VUz2lreH9s0NDnyq6Gzh9bszUvdfiSOG8clOU7hCQtz7fWgr_Wy0)