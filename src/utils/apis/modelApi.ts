import { createApiInstance } from "../requestApi";

// const modelApiBaseUrl = import.meta.env.VITE_API_BE_URL;
const modelApiBaseUrl = import.meta.env.VITE_API_MODEL_URL;
const api = createApiInstance(modelApiBaseUrl);

const getResponse = async (query: string): Promise<string> => {
  return api.makeRequest<string>({
    url: "get-response",
    method: "POST",
    data: {
      query,
    },
  });
};

interface StreamingCallbacks {
  onToken?: (token: string) => void;
  onStart?: () => void;
  onEnd?: (fullResponse: string) => void;
  onError?: (error: Error) => void;
}

interface QueryRequest {
  query: string;
}

interface StreamingOptions {
  apiUrl?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * Gọi API streaming và xử lý response theo từng token
 * @param query - Câu hỏi của user
 * @param callbacks - Các callback functions
 * @param options - Các options cho request
 */
const getStreamingResponse = async (
  query: string,
  callbacks: StreamingCallbacks = {},
  options: StreamingOptions = {}
): Promise<void> => {
  const {
    onToken = () => {},
    onStart = () => {},
    onEnd = () => {},
    onError = () => {}
  } = callbacks;

  const {
    apiUrl = `${modelApiBaseUrl}/get-response-stream`,
    headers = {},
    timeout = 60000
  } = options;

  let fullResponse = '';

  try {
    // Tạo AbortController cho timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Gọi API bằng fetch để tạo streaming connection
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        ...headers
      },
      body: JSON.stringify({ query } as QueryRequest),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    // Đọc stream bằng ReadableStream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let pendingData: string | null = null; // lưu JSON chưa đầy đủ
    let isEnded = false;

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        // Decode chunk data với buffer để tránh cắt giữa JSON
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // SSE thường phân tách sự kiện bằng dòng trống \n\n, nhưng để an toàn, xử lý theo từng dòng
        const lines = buffer.split('\n');
        // giữ lại phần cuối có thể chưa hoàn chỉnh
        buffer = lines.pop() ?? '';

        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (!line) continue; // skip keepalive/dòng trống
          if (!line.startsWith('data:')) continue; // chỉ quan tâm data

          const payloadPart = line.slice(5).trim(); // bỏ 'data:'
          if (!payloadPart) continue;

          // Ghép với phần JSON còn dở trước đó (nếu có)
          const jsonString: string = (pendingData ? pendingData : '') + payloadPart;

          let eventObj: any = null;
          try {
            eventObj = JSON.parse(jsonString);
            pendingData = null; // parse ok -> xoá pending
          } catch {
            // có thể JSON bị cắt, lưu lại rồi đợi chunk tiếp theo
            pendingData = jsonString;
            continue;
          }

          if (!eventObj || typeof eventObj !== 'object') continue;

          const eventType = eventObj.type as string | undefined;
          switch (eventType) {
            case 'start': {
              // Có thể có message khởi tạo, nhưng callback không nhận tham số
              onStart();
              break;
            }
            case 'token': {
              const token = typeof eventObj.content === 'string' ? eventObj.content : '';
              if (token) {
                fullResponse += token;
                onToken(token);
              }
              break;
            }
            case 'end': {
              // Có thể có response_length ... Kết thúc stream
              if (!isEnded) {
                isEnded = true;
                onEnd(fullResponse);
              }
              break;
            }
            default: {
              // Bỏ qua các loại khác nếu có
              break;
            }
          }
        }

        if (isEnded) break;
      }
    } finally {
      reader.releaseLock();
    }

    // Nếu server không gửi 'end' event rõ ràng, vẫn kết thúc với nội dung đã nhận
    if (!isEnded) {
      onEnd(fullResponse);
    }

  } catch (error) {
    console.error('Streaming error:', error);
    
    if (error instanceof Error) {
      onError(error);
    } else {
      onError(new Error('Unknown streaming error'));
    }
  }
};

/**
 * Version Promise của getStreamingResponse - có thể sử dụng với async/await
 * @param query - Câu hỏi của user
 * @param onToken - Callback cho từng token
 * @param options - Các options cho request
 * @returns Promise resolve với full response
 */
async function getStreamingResponsePromise(
  query: string,
  onToken: (token: string) => void = () => {},
  options: StreamingOptions = {}
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    getStreamingResponse(
      query, 
      {
        onToken,
        onEnd: resolve,
        onError: reject
      },
      options
    );
  });
}

export const modelApi = { getResponse, getStreamingResponse, getStreamingResponsePromise };
