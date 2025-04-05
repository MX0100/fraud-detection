async function submitBatchTransactions(transactions) {
  try {
    const response = await fetch("/api/transaction/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactions),
    });

    // 检查HTTP状态码
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    // 读取响应文本
    const responseText = await response.text();
    console.log("批量处理响应:", responseText);

    // 如果响应包含起始状态信息但不是错误
    if (responseText.includes("Batch processing started")) {
      // 不要将其视为错误，而是正常处理状态
      console.log("批处理已开始");

      // 这里可以启动一个轮询来检查处理状态
      checkProcessingStatus();
      return;
    }

    // 处理JSONL响应
    const jsonObjects = parseJsonlResponse(responseText);
    updateSuspiciousTransactionsTable(jsonObjects);
  } catch (error) {
    // 调用修改后的错误处理函数
    handleBatchTransactionError(error);
  }
}

// 解析JSONL响应
function parseJsonlResponse(responseText) {
  return responseText
    .trim()
    .split("\n")
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch (e) {
        console.error("解析JSONL行失败:", line, e);
        return null;
      }
    })
    .filter((obj) => obj !== null);
}
