import { useState } from "react";
import React from "react";
import "./Dropzone.css";

interface DropzoneProps {
  onFileParsed: (data: any[], file: File) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileParsed }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      const parsedData = parseACHFile(content);
      onFileParsed(parsedData, file);
    };

    reader.readAsText(file);
  };

  // Generate transaction ID
  const generateTransactionId = (): string => {
    // Generate random transaction ID format: TX-YYYYMMDD-random6digits
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");

    return `TX-${year}${month}${day}-${random}`;
  };

  const parseACHFile = (fileContent: string) => {
    return fileContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("6") && line.length >= 69) // Ensure sufficient length
      .map((line) => ({
        transactionId: generateTransactionId(), // Add unique ID for each transaction
        routingNumber: line.slice(3, 12),
        accountNumber: line.slice(12, 29).trim(),
        amount: isNaN(parseFloat(line.slice(29, 39)))
          ? 0
          : parseFloat(line.slice(29, 39)) / 100,
        individualName: line.slice(39, 54).padEnd(15, " ").trim(),
        traceNumber: line.slice(54, 69).trim(),
        timestamp: new Date().toISOString(), // Add timestamp
        currency: "USD", // Add default currency
        isFraudulent: false, // Default not fraudulent
        isSuspicious: false, // Default not suspicious
      }));
  };

  return (
    <div className="dropzone-container">
      <label htmlFor="file-upload" className="file-label">
        Select File
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".ach,.txt"
        onChange={handleFileUpload}
      />
      {fileName && <p className="uploaded-file">Uploaded: {fileName}</p>}
    </div>
  );
};

export default Dropzone;
