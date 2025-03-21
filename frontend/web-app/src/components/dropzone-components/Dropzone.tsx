import { useState } from "react";
import React from 'react';
import "./Dropzone.css";

const Dropzone = ({ onFileParsed }: { onFileParsed: (data: any[]) => void }) => {
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();

        reader.onload = (e) => {
            const content = e.target?.result as string;
            const parsedData = parseACHFile(content);
            onFileParsed(parsedData);
        };

        reader.readAsText(file);
    };

    const parseACHFile = (fileContent: string) => {
        return fileContent
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.startsWith("6") && line.length >= 69) // 确保长度足够
            .map(line => ({
                routingNumber: line.slice(3, 12),
                accountNumber: line.slice(12, 29).trim(),
                amount: isNaN(parseFloat(line.slice(29, 39))) ? 0 : parseFloat(line.slice(29, 39)) / 100,
                individualName: line.slice(39, 54).padEnd(15, " ").trim(),
                traceNumber: line.slice(54, 69).trim()
            }));
    };

    return (
        <div className="dropzone-container">
            <label htmlFor="file-upload" className="file-label">Choose File</label>
            <input id="file-upload" type="file" accept=".ach,.txt" onChange={handleFileUpload} />
            {fileName && <p className="uploaded-file">Uploaded: {fileName}</p>}
        </div>
    );
};

export default Dropzone;
