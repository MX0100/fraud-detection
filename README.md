# ACH Fraud Detection System

A comprehensive system for detecting and preventing fraudulent ACH (Automated Clearing House) transactions.

## Project Overview

This project consists of a robust fraud detection platform specifically designed for ACH transactions. The system analyzes transaction patterns and flags suspicious activities based on predefined risk factors.

## Getting Started

Before running the application, please review the following documentation:

1. **API Documentation**: Review `API_DOCUMENTATION.md` in the root directory for details about the available API endpoints.

2. **Backend Documentation**: See `backend/README.md` for instructions on setting up and running the backend server.

3. **Frontend Documentation**: See `frontend/README.md` for instructions on setting up and running the web application.

## System Components

### Backend

The backend is built with Spring Boot and provides RESTful APIs for transaction processing and fraud detection. It leverages machine learning algorithms to analyze transaction patterns and identify potential fraud.

### Frontend

The frontend is a React application that provides an intuitive interface for uploading ACH files, viewing transactions, and investigating suspicious activities.

### Utils

In the `utils` directory, you'll find helpful tools for development and testing:

- **ACH File Generator**: A utility for generating mock ACH files for testing. This is particularly useful during development to simulate various transaction scenarios.

## Key Features

- ACH file upload and parsing
- Real-time transaction analysis
- Fraud detection using machine learning algorithms
- Risk scoring for transactions
- Manual review workflow for suspicious transactions
- Comprehensive dashboard for monitoring activities

## Development Setup

### Prerequisites

- Node.js (v14+)
- Java (JDK 11+)
- PostgreSQL
- Maven

### Running the Application

1. Start the backend server (refer to backend documentation)
2. Start the frontend application (refer to frontend documentation)
3. Access the application at `http://localhost:3000`

## Testing

For testing the application without real ACH files, use the ACH file generator utility in the `utils` directory to create sample files with various transaction patterns.

## Security Notes

- This system handles sensitive financial information. Ensure proper security measures are in place in production environments.
- All transaction data should be encrypted in transit and at rest.
- Access to the system should be properly authenticated and authorized.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
