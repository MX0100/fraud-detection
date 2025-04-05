export async function uploadACHFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/transaction/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("网络连接错误，可能是CORS或服务器未启动:", error);
      return {
        success: false,
        message: "无法连接到服务器，请确认服务器已启动并允许跨域请求",
      };
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      console.error("请求超时:", error);
      return { success: false, message: "请求超时，服务器响应时间过长" };
    }

    console.error("上传文件时出错:", error);
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    return { success: false, message: errorMessage };
  }
}

// 批量提交交易API
export async function submitTransactionsBatch(transactions: any[]) {
  // 确保每个交易都有transaction_id字段
  const transactionsWithIds = transactions.map((tx) => {
    if (!tx.transactionId) {
      return {
        ...tx,
        transactionId: generateTransactionId(),
        // 如果没有时间戳，添加当前时间
        timestamp: tx.timestamp || new Date().toISOString(),
        // 默认货币为USD
        currency: tx.currency || "USD",
        // 确保有欺诈和可疑标志
        isFraudulent: tx.isFraudulent !== undefined ? tx.isFraudulent : false,
        isSuspicious: tx.isSuspicious !== undefined ? tx.isSuspicious : false,
      };
    }
    return {
      ...tx,
      // 确保这些字段存在
      isFraudulent: tx.isFraudulent !== undefined ? tx.isFraudulent : false,
      isSuspicious: tx.isSuspicious !== undefined ? tx.isSuspicious : false,
    };
  });

  try {
    const response = await fetch("/api/transactions/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionsWithIds),
      credentials: "include",
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 检查Content-Type响应头
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      // 将API标准响应格式转换为我们内部使用的格式
      return {
        success: data.status === "success",
        message: data.message || "",
        data: data.count ? { count: data.count } : null,
      };
    } else {
      // 处理非JSON响应
      const textResponse = await response.text();
      return {
        success: true,
        message: textResponse,
        data: null,
      };
    }
  } catch (error: unknown) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("网络连接错误，可能是CORS或服务器未启动:", error);
      return {
        success: false,
        message: "无法连接到服务器，请确认服务器已启动并允许跨域请求",
      };
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      console.error("请求超时:", error);
      return { success: false, message: "请求超时，服务器响应时间过长" };
    }

    console.error("批量提交交易时出错:", error);
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    return { success: false, message: errorMessage };
  }
}

// 获取交易列表API
export async function getTransactions(page = 1, limit = 10, filters = {}) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters,
  });

  try {
    const response = await fetch(`/api/transaction?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("网络连接错误，可能是CORS或服务器未启动:", error);
      return {
        success: false,
        message: "无法连接到服务器，请确认服务器已启动并允许跨域请求",
        data: [],
      };
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      console.error("请求超时:", error);
      return {
        success: false,
        message: "请求超时，服务器响应时间过长",
        data: [],
      };
    }

    console.error("获取交易列表时出错:", error);
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    return { success: false, message: errorMessage, data: [] };
  }
}

// 获取可疑交易列表API
export async function getSuspiciousTransactions(
  page = 1,
  limit = 10,
  transactionId = ""
) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  // 如果提供了交易ID，添加到查询参数
  if (transactionId && transactionId.trim() !== "") {
    queryParams.append("transactionId", transactionId.trim());
  }

  try {
    console.log(`发送请求到: GET /api/suspicious-transactions?${queryParams}`);

    const response = await fetch(
      `/api/suspicious-transactions?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        signal: AbortSignal.timeout(15000),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("后端返回的可疑交易数据:", data); // 添加调试日志

    // 根据API文档，响应格式应该是 {status, count, transactions}
    if (data && data.status === "success") {
      return {
        success: true,
        message: data.message || "",
        data: data.transactions || [],
        total: data.count || 0,
      };
    }

    // 后端可能直接返回数组或其他格式，尝试灵活处理
    if (Array.isArray(data)) {
      return {
        success: true,
        message: "",
        data: data,
        total: data.length,
      };
    }

    // 如果是其他格式
    return {
      success: data.status === "success" || false,
      message: data.message || "",
      data: data.transactions || data.data || [],
      total: data.count || data.total || 0,
    };
  } catch (error: unknown) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("网络连接错误，可能是CORS或服务器未启动:", error);
      return {
        success: false,
        message: "无法连接到服务器，请确认服务器已启动并允许跨域请求",
        data: [],
        total: 0,
      };
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      console.error("请求超时:", error);
      return {
        success: false,
        message: "请求超时，服务器响应时间过长",
        data: [],
        total: 0,
      };
    }

    console.error("获取可疑交易列表时出错:", error);
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    return { success: false, message: errorMessage, data: [], total: 0 };
  }
}

// 获取交易详情API
export async function getTransactionDetails(transactionId: string) {
  try {
    const response = await fetch(`/api/transaction/${transactionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // 将API标准响应格式转换为我们内部使用的格式
    return {
      success: data.status === "success",
      message: data.message || "",
      data: data.transaction || data, // 适配可能的不同响应格式
    };
  } catch (error: unknown) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("网络连接错误，可能是CORS或服务器未启动:", error);
      return {
        success: false,
        message: "无法连接到服务器，请确认服务器已启动并允许跨域请求",
      };
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      console.error("请求超时:", error);
      return { success: false, message: "请求超时，服务器响应时间过长" };
    }

    console.error("获取交易详情时出错:", error);
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    return { success: false, message: errorMessage };
  }
}

// 提交人工审核API
export async function submitManualReview(
  transactionId: string,
  reviewData: any
) {
  try {
    const response = await fetch(
      `/api/transaction/${transactionId}/manual-review`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isFraudulent: !reviewData.isAccepted,
        }),
        credentials: "include",
        signal: AbortSignal.timeout(15000),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // 将API标准响应格式转换为我们内部使用的格式
    return {
      success: data.status === "success",
      message: data.message || "",
      data: data,
    };
  } catch (error: unknown) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("网络连接错误，可能是CORS或服务器未启动:", error);
      return {
        success: false,
        message: "无法连接到服务器，请确认服务器已启动并允许跨域请求",
      };
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      console.error("请求超时:", error);
      return { success: false, message: "请求超时，服务器响应时间过长" };
    }

    console.error("提交人工审核时出错:", error);
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    return { success: false, message: errorMessage };
  }
}

// 获取欺诈检测统计数据API
export async function getFraudStatistics(timeRange = "week") {
  try {
    const response = await fetch(`/api/statistics?timeRange=${timeRange}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("网络连接错误，可能是CORS或服务器未启动:", error);
      return {
        success: false,
        message: "无法连接到服务器，请确认服务器已启动并允许跨域请求",
      };
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      console.error("请求超时:", error);
      return { success: false, message: "请求超时，服务器响应时间过长" };
    }

    console.error("获取统计数据时出错:", error);
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    return { success: false, message: errorMessage };
  }
}

// 生成交易ID的辅助函数
function generateTransactionId(): string {
  // 生成随机的交易ID格式：TX-年月日-随机6位数
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");

  return `TX-${year}${month}${day}-${random}`;
}
