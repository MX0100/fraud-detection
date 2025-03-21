export function parseACHFile(fileContent: string) {
    const lines = fileContent.split("\n").map(line => line.trim());
    const transactions = [];

    for (const line of lines) {
        if (line.startsWith("6")) {
            // Entry Detail Record
            const transaction = {
                recordType: line[0], // "6" means transaction entry
                routingNumber: line.substring(3, 12),
                accountNumber: line.substring(12, 29).trim(),
                amount: parseFloat(line.substring(29, 39)) / 100, // Convert cents to dollars
                individualName: line.substring(39, 54).trim(),
                traceNumber: line.substring(79, 94).trim(),
            };
            transactions.push(transaction);
        }
    }

    return transactions;
}
