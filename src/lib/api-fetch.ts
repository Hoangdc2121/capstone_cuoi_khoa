import { API_CONFIG } from "@/config/api.config";

// <T> là kiểu dữ liệu của dữ liệu trả về khi API thành công, có thể là bất kỳ kiểu nào
export type ApiResponse<T> = {
  content: T;
  message: string;
  statusCode: number;
};

// Giữ mã HTTP và nội dung lỗi để Route Handler xử lý.
export class ApiFetchError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiFetchError";
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const baseURL = API_CONFIG.BASE_URL;

  if (!baseURL) {
    throw new Error("Chưa cấu hình NEXT_PUBLIC_API trong .env.local");
  }

  // Nối URL, tránh thừa hoặc thiếu dấu "/".
  const url = `${baseURL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  const tokenCybersoft = process.env.TOKEN_CYBERSOFT;

  if (!tokenCybersoft) {
    throw new Error("Chưa cấu hình TOKEN_CYBERSOFT trong .env.local");
  }

  headers.set("tokenCybersoft", tokenCybersoft);
  // Không tự đặt Content-Type khi gửi FormData.
  if (typeof options.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    cache: options.cache ?? "no-store",
    headers,
  });

  const text = await response.text();

  let data: unknown = undefined;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new ApiFetchError(
        "Backend trả về dữ liệu không đúng định dạng JSON.",
        response.status,
      );
    }
  }

  if (!response.ok) {
    let message = `Yêu cầu thất bại (${response.status}).`;

    if (typeof data === "object" && data !== null) {
      if (
        "content" in data &&
        typeof data.content === "string" &&
        data.content.trim()
      ) {
        message = data.content;
      } else if (
        "message" in data &&
        typeof data.message === "string" &&
        data.message.trim()
      ) {
        message = data.message;
      }
    }

    throw new ApiFetchError(message, response.status, data);
  }

  return data as T;
}
