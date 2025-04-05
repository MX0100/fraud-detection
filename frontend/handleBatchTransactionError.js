function handleBatchTransactionError(error) {
  // 检查是否包含批处理开始信息
  if (error.message && error.message.includes("Batch processing started")) {
    // 这不是错误，而是状态信息，不要显示错误提示
    console.log("批处理已开始，等待结果...");
    return;
  }

  // 对于实际错误才显示错误信息
  showErrorMessage("批量提交交易失败: " + (error.message || error));
}
