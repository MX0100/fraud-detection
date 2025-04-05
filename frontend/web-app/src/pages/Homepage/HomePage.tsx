import { useState, useEffect, useRef } from "react";
import Dropzone from "../../components/dropzone-components/Dropzone";
import Button from "../../components/button-components";
import TransactionTable from "../../components/table-components/TransactionTable";
import SuspiciousTransactionTable from "../../components/table-components/SuspiciousTransactionTable";
import {
  getSuspiciousTransactions,
  submitTransactionsBatch,
  getTransactionDetails,
  submitManualReview,
} from "../../services/api";
import "./HomePage.css";

interface Transaction {
  routingNumber: string;
  accountNumber: string;
  amount: number;
  individualName: string;
  traceNumber: string;
  transactionId?: string;
  timestamp?: string;
  currency?: string;
}

interface SuspiciousTransaction {
  id: string;
  transactionId: string;
  routingNumber: string;
  accountNumber: string;
  amount: number;
  individualName: string;
  traceNumber: string;
  riskScore: number;
  fraudIndicators: string[];
  timestamp: string;
}

const HomePage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [suspiciousTransactions, setSuspiciousTransactions] = useState<
    SuspiciousTransaction[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(
    null
  );
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const [showContent, setShowContent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchId, setSearchId] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  // Store all suspicious transactions for frontend pagination
  const [allSuspiciousTransactions, setAllSuspiciousTransactions] = useState<
    SuspiciousTransaction[]
  >([]);
  // Whether to enable frontend pagination (use when backend doesn't support pagination)
  const [useFrontendPaging, setUseFrontendPaging] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowContent(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load suspicious transaction data
  useEffect(() => {
    fetchSuspiciousTransactions(1, pageSize, "");
  }, []);

  // Function to log request status
  const logRequestStatus = (message: string) => {
    setRequestStatus(
      (prev) =>
        `${
          prev ? prev + "\n" : ""
        }${new Date().toLocaleTimeString()} - ${message}`
    );
  };

  // Clear error message
  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  // Get suspicious transaction list
  const fetchSuspiciousTransactions = async (
    page = currentPage,
    size = pageSize,
    id = searchId
  ) => {
    try {
      setIsLoading(true);
      clearErrorMessage();
      logRequestStatus(
        `Fetching suspicious transactions... Page: ${page}, Size: ${size}${
          id ? ", Search ID: " + id : ""
        }`
      );

      const response = await getSuspiciousTransactions(page, size, id);
      console.log("Suspicious transactions response:", response); // Add debug log

      if (response && response.success) {
        // Ensure data is an array
        const transactions = Array.isArray(response.data) ? response.data : [];

        // Frontend pagination implementation
        if (useFrontendPaging) {
          // Store all transaction data
          setAllSuspiciousTransactions(transactions);
          // Calculate total
          const total = transactions.length;
          setTotalItems(total);
          console.log(
            `Using frontend pagination: Total transactions: ${total}, Total pages: ${Math.ceil(
              total / size
            )}`
          );

          // Apply search filter (if search condition exists)
          const filteredData = id
            ? transactions.filter(
                (tx) =>
                  (tx.transactionId && tx.transactionId.includes(id)) ||
                  (tx.id && tx.id.includes(id))
              )
            : transactions;

          // Manual pagination slicing
          const startIndex = (page - 1) * size;
          const endIndex = Math.min(startIndex + size, filteredData.length);
          const pagedData = filteredData.slice(startIndex, endIndex);

          // Update UI displayed data
          setSuspiciousTransactions(pagedData);
          logRequestStatus(
            `Frontend pagination: Retrieved ${transactions.length} records, ` +
              `Filtered to ${filteredData.length} records, ` +
              `Current page ${page} showing ${pagedData.length} records (${
                startIndex + 1
              }-${endIndex})`
          );
        } else {
          // Use backend pagination
          setSuspiciousTransactions(transactions);
          setTotalItems(response.total);
          console.log(
            `Using backend pagination: Total transactions: ${
              response.total
            }, Total pages: ${Math.ceil(response.total / size)}`
          );
          logRequestStatus(
            `Successfully retrieved ${transactions.length} suspicious transactions, Total: ${response.total}`
          );
        }
      } else {
        const errorMsg = response?.message || "Unknown error";
        setErrorMessage(`Failed to get suspicious transactions: ${errorMsg}`);
        logRequestStatus(`Failed to get suspicious transactions: ${errorMsg}`);
        // Set to empty array to avoid undefined errors
        setSuspiciousTransactions([]);
        console.error("Failed to get suspicious transactions:", errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setErrorMessage(`Error fetching suspicious transactions: ${errorMsg}`);
      logRequestStatus(`Error fetching suspicious transactions: ${errorMsg}`);
      // Set to empty array to avoid undefined errors
      setSuspiciousTransactions([]);
      console.error("Error fetching suspicious transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // View transaction details
  const handleViewDetails = async (id: string) => {
    try {
      setIsLoading(true);
      clearErrorMessage();
      logRequestStatus(`Fetching details for transaction ${id}...`);

      setSelectedTransaction(id);
      const details = await getTransactionDetails(id);

      if (details && details.data) {
        setTransactionDetails(details.data);
        logRequestStatus("Transaction details retrieved successfully");
      } else if (details && details.success === false) {
        setErrorMessage(
          `Failed to get transaction details: ${details.message}`
        );
        logRequestStatus(
          `Failed to get transaction details: ${details.message}`
        );
        alert(`Failed to get transaction details: ${details.message}`);
        setSelectedTransaction(null);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setErrorMessage(`Error getting transaction details: ${errorMsg}`);
      logRequestStatus(`Error getting transaction details: ${errorMsg}`);
      console.error("Error fetching transaction details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Close details modal
  const handleCloseDetails = () => {
    setSelectedTransaction(null);
    setTransactionDetails(null);
  };

  // Handle file upload and parsing
  const handleFileParsed = (parsedData: Transaction[], file: File) => {
    setTransactions(parsedData);
    logRequestStatus(
      `File parsed successfully, ${parsedData.length} transactions`
    );
  };

  // Retry submission
  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount((prev) => prev + 1);
      logRequestStatus(`Retrying... (${retryCount + 1}/${maxRetries})`);
      handleSubmitTransactions();
    } else {
      setErrorMessage(
        "Maximum retry attempts reached. Please check server status or contact administrator"
      );
      logRequestStatus("Maximum retry attempts reached");
    }
  };

  // Submit transaction data
  const handleSubmitTransactions = async () => {
    if (transactions.length === 0) {
      alert("No transactions to submit");
      return;
    }

    try {
      setIsLoading(true);
      clearErrorMessage();
      logRequestStatus(
        `Submitting batch of ${transactions.length} transactions...`
      );

      const response = await submitTransactionsBatch(transactions);

      if (response && response.success) {
        // Could have two success situations: JSON response or text response
        let successMessage = response.message;
        if (!successMessage) {
          successMessage = `Successfully submitted ${transactions.length} transactions! Analysis in progress...`;
        }

        logRequestStatus(successMessage);
        alert(successMessage);
        setRetryCount(0); // Reset retry count after success

        // Immediately get latest suspicious transaction list
        logRequestStatus("Fetching latest suspicious transaction data...");
        await fetchSuspiciousTransactions(1, pageSize, searchId);
      } else {
        const errorMsg = response.message || "Unknown error";
        const failMessage = `Batch transaction submission failed: ${errorMsg}`;

        setErrorMessage(failMessage);
        logRequestStatus(failMessage);

        // Check if connection error
        if (
          errorMsg.includes("Cannot connect to server") ||
          errorMsg.includes("Failed to fetch")
        ) {
          setErrorMessage(
            `${failMessage}. Please check if backend server is running and correctly configured.`
          );
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setErrorMessage(`Processing failed: ${errorMsg}`);
      logRequestStatus(`Processing failed: ${errorMsg}`);
      console.error("Error processing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle manual review submission
  const handleManualReview = async (
    transactionId: string,
    isAccepted: boolean
  ) => {
    try {
      setIsLoading(true);
      logRequestStatus(
        `Submitting manual review - Transaction ID: ${transactionId}, Status: ${
          isAccepted ? "Approved" : "Rejected"
        }`
      );

      const response = await submitManualReview(transactionId, {
        isAccepted,
        reviewNote: isAccepted
          ? "Transaction verified"
          : "Transaction marked as fraud",
      });

      if (response && response.success) {
        alert(isAccepted ? "Marked as processed" : "Reported as fraud");
        logRequestStatus("Manual review submitted successfully");
        setSelectedTransaction(null);
        setTransactionDetails(null);

        // Refresh suspicious transaction list
        await fetchSuspiciousTransactions(1, pageSize, searchId);
      } else {
        const errorMsg = response.message || "Unknown error";
        setErrorMessage(`Manual review submission failed: ${errorMsg}`);
        logRequestStatus(`Manual review submission failed: ${errorMsg}`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setErrorMessage(`Manual review processing failed: ${errorMsg}`);
      logRequestStatus(`Manual review processing failed: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if connection error
  const isConnectionError = () => {
    return (
      errorMessage &&
      (errorMessage.includes("Cannot connect to server") ||
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("Request timeout") ||
        errorMessage.includes("CORS") ||
        errorMessage.includes("network"))
    );
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // Frontend pagination processing
    if (useFrontendPaging && allSuspiciousTransactions.length > 0) {
      // First apply search filter (if any)
      const filteredData = searchId
        ? allSuspiciousTransactions.filter(
            (tx) =>
              (tx.transactionId && tx.transactionId.includes(searchId)) ||
              (tx.id && tx.id.includes(searchId))
          )
        : allSuspiciousTransactions;

      // Then calculate page range
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, filteredData.length);

      // Get current page data
      const pagedData = filteredData.slice(startIndex, endIndex);

      // Update UI display
      setSuspiciousTransactions(pagedData);
      logRequestStatus(
        `Frontend pagination: Switched to page ${page}/${Math.ceil(
          filteredData.length / pageSize
        )}, ` +
          `Showing records ${startIndex + 1} to ${endIndex} (Total: ${
            filteredData.length
          } records)`
      );
    } else {
      // Backend pagination request
      fetchSuspiciousTransactions(page, pageSize, searchId);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    // Update page size
    setPageSize(size);
    // Reset to first page
    setCurrentPage(1);

    // Frontend pagination processing
    if (useFrontendPaging && allSuspiciousTransactions.length > 0) {
      // First apply search filter (if any)
      const filteredData = searchId
        ? allSuspiciousTransactions.filter(
            (tx) =>
              (tx.transactionId && tx.transactionId.includes(searchId)) ||
              (tx.id && tx.id.includes(searchId))
          )
        : allSuspiciousTransactions;

      // Get first page data
      const pagedData = filteredData.slice(0, size);

      // Update UI display
      setSuspiciousTransactions(pagedData);
      setTotalItems(filteredData.length); // Ensure total count is correct

      logRequestStatus(
        `Frontend pagination: Page size changed to ${size} records, ` +
          `Showing records 1 to ${Math.min(
            size,
            filteredData.length
          )} (Total: ${filteredData.length} records)`
      );
    } else {
      // Backend pagination request
      fetchSuspiciousTransactions(1, size, searchId);
    }
  };

  // Handle ID search
  const handleSearch = () => {
    // Reset to first page
    setCurrentPage(1);

    // Frontend pagination processing
    if (useFrontendPaging && allSuspiciousTransactions.length > 0) {
      // Apply search filter
      const filteredData = searchId
        ? allSuspiciousTransactions.filter(
            (tx) =>
              (tx.transactionId && tx.transactionId.includes(searchId)) ||
              (tx.id && tx.id.includes(searchId))
          )
        : allSuspiciousTransactions;

      // Get first page data
      const pagedData = filteredData.slice(0, pageSize);

      // Update UI display and total
      setSuspiciousTransactions(pagedData);
      setTotalItems(filteredData.length);

      if (filteredData.length === 0) {
        logRequestStatus(
          `Frontend search: "${searchId}" No matching records found. Total: ${allSuspiciousTransactions.length} records`
        );
      } else {
        logRequestStatus(
          `Frontend search: "${searchId}" Found ${filteredData.length} matching records, ` +
            `Showing records 1 to ${Math.min(pageSize, filteredData.length)}`
        );
      }
    } else {
      // Backend search request
      fetchSuspiciousTransactions(1, pageSize, searchId);
    }
  };

  // Clear search
  const clearSearch = () => {
    // Clear search keyword
    setSearchId("");
    // Reset to first page
    setCurrentPage(1);

    // Frontend pagination processing
    if (useFrontendPaging && allSuspiciousTransactions.length > 0) {
      // No filter, use all data
      const filteredData = allSuspiciousTransactions;

      // Get first page data
      const pagedData = filteredData.slice(0, pageSize);

      // Update UI display and total
      setSuspiciousTransactions(pagedData);
      setTotalItems(filteredData.length);

      logRequestStatus(
        `Frontend pagination: Search cleared, showing records 1 to ${Math.min(
          pageSize,
          filteredData.length
        )} ` + `(Total: ${filteredData.length} records)`
      );
    } else {
      // Backend request
      fetchSuspiciousTransactions(1, pageSize, "");
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <>
      <div className="hero-section">
        <h1 className="hero-title">ACH Fraud Detection System</h1>
        <p className="hero-subtitle">
          Efficient, accurate ACH transaction fraud detection and prevention
        </p>
        <div className="scroll-indicator">↓ Scroll to explore ↓</div>
      </div>
      <div className={`content-container ${showContent ? "visible" : ""}`}>
        <section className="upload-section">
          <h2>Upload ACH File</h2>
          <Dropzone onFileParsed={handleFileParsed} />
          {transactions.length > 0 && (
            <>
              <h3>Parsed Transactions ({transactions.length})</h3>
              <TransactionTable transactions={transactions} />
              <div className="action-area">
                <Button
                  onClick={handleSubmitTransactions}
                  label="Submit Transaction Batch"
                  disabled={isLoading}
                />
                {isConnectionError() && retryCount < maxRetries && (
                  <Button
                    onClick={handleRetry}
                    label={`Retry (${retryCount}/${maxRetries})`}
                    className="retry-btn"
                    disabled={isLoading}
                  />
                )}
              </div>
            </>
          )}
        </section>

        {errorMessage && (
          <div className="error-message">
            <div className="error-content">
              <h4>Error Information</h4>
              <p>{errorMessage}</p>
              {isConnectionError() && (
                <div className="error-tips">
                  <h5>Possible Solutions:</h5>
                  <ul>
                    <li>
                      Confirm backend server is running on correct port (8080)
                    </li>
                    <li>Check if backend has CORS properly configured</li>
                    <li>Verify network connection</li>
                    <li>Check API address in frontend configuration</li>
                  </ul>
                </div>
              )}
            </div>
            <button onClick={clearErrorMessage} className="close-error-btn">
              ×
            </button>
          </div>
        )}

        <section className="suspicious-section">
          <h2>Suspicious Transactions</h2>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Enter transaction ID to search"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
            {searchId && (
              <button className="clear-btn" onClick={clearSearch}>
                Clear
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              <SuspiciousTransactionTable
                transactions={suspiciousTransactions}
                onViewDetails={handleViewDetails}
              />

              {searchId && suspiciousTransactions.length === 0 && (
                <div className="no-results-message">
                  No transactions found containing "
                  <span className="search-term">{searchId}</span>"
                  <button className="clear-btn" onClick={clearSearch}>
                    Clear Search
                  </button>
                </div>
              )}

              {/* Pagination debug info, only visible in development environment */}
              {process.env.NODE_ENV === "development" && (
                <div className="pagination-debug">
                  <details>
                    <summary>Pagination Debug Info</summary>
                    <pre>
                      {JSON.stringify(
                        {
                          currentPage,
                          pageSize,
                          totalItems,
                          totalPages,
                          actualDataLength: suspiciousTransactions.length,
                          useFrontendPaging,
                        },
                        null,
                        2
                      )}
                    </pre>
                    <div className="pagination-toggle">
                      <label>
                        <input
                          type="checkbox"
                          checked={useFrontendPaging}
                          onChange={() => {
                            setUseFrontendPaging(!useFrontendPaging);
                            // Reset page and refetch data
                            setCurrentPage(1);
                            fetchSuspiciousTransactions(1, pageSize, searchId);
                          }}
                        />
                        Enable frontend pagination (use when backend doesn't
                        support pagination)
                      </label>
                    </div>
                  </details>
                </div>
              )}

              {/* Pagination controls */}
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="page-btn"
                >
                  First
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="page-btn"
                >
                  Previous
                </button>
                <span className="page-info">
                  Current: Page <b>{currentPage}</b> | <b>{pageSize}</b> per
                  page | Total <b>{totalItems}</b> records | <b>{totalPages}</b>{" "}
                  pages
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="page-btn"
                >
                  Next
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="page-btn"
                >
                  Last
                </button>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="page-size-select"
                >
                  <option value="5">5 per page</option>
                  <option value="10">10 per page</option>
                  <option value="20">20 per page</option>
                  <option value="50">50 per page</option>
                </select>
              </div>
            </>
          )}
        </section>

        {/* Debug panel - can be removed in production */}
        <div className="debug-panel">
          <h4>Request Logs</h4>
          <pre>{requestStatus || "No request logs"}</pre>
          <div className="debug-actions">
            <button
              onClick={() => setRequestStatus(null)}
              className="clear-logs-btn"
            >
              Clear Logs
            </button>
            <button
              onClick={() => window.location.reload()}
              className="reload-btn"
            >
              Refresh Page
            </button>
          </div>
        </div>

        {selectedTransaction && transactionDetails && (
          <div className="transaction-details-modal">
            <div className="modal-content">
              <button className="close-btn" onClick={handleCloseDetails}>
                ×
              </button>
              <h3>Transaction Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">Transaction ID:</span>
                  <span>
                    {transactionDetails.transactionId || transactionDetails.id}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Routing Number:</span>
                  <span>{transactionDetails.routingNumber}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Account Number:</span>
                  <span>{transactionDetails.accountNumber}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Amount:</span>
                  <span>${transactionDetails.amount.toFixed(2)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Timestamp:</span>
                  <span>
                    {new Date(transactionDetails.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Risk Score:</span>
                  <span>{transactionDetails.riskScore}</span>
                </div>
              </div>
              <div className="detail-full-width">
                <h4>Fraud Indicators</h4>
                <ul>
                  {transactionDetails.fraudIndicators &&
                    transactionDetails.fraudIndicators.map(
                      (indicator: string, i: number) => (
                        <li key={i}>{indicator}</li>
                      )
                    )}
                  {(!transactionDetails.fraudIndicators ||
                    transactionDetails.fraudIndicators.length === 0) && (
                    <li>No fraud indicators</li>
                  )}
                </ul>
              </div>
              <div className="detail-full-width">
                <h4>Analysis Results</h4>
                <p>
                  {transactionDetails.analysisResults ||
                    "No analysis available"}
                </p>
              </div>
              <div className="action-buttons">
                <Button
                  onClick={() =>
                    handleManualReview(
                      transactionDetails.transactionId || transactionDetails.id,
                      true
                    )
                  }
                  label="Mark as Processed"
                />
                <Button
                  onClick={() =>
                    handleManualReview(
                      transactionDetails.transactionId || transactionDetails.id,
                      false
                    )
                  }
                  label="Report as Fraud"
                  className="warning"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
