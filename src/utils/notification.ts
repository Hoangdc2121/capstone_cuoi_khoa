import type { App } from "antd";
import type { ReactNode } from "react";

// Lấy kiểu message từ Ant Design.
type MessageApi = ReturnType<typeof App.useApp>["message"];

let messageApi: MessageApi | null = null;

export const setMessageApi = (api: MessageApi | null) => {
  messageApi = api;
};

export const notifySuccess = (text: ReactNode) => {
  return messageApi?.success(text);
};

export const notifyError = (text: ReactNode) => {
  return messageApi?.error(text);
};

export const notifyWarning = (text: ReactNode) => {
  return messageApi?.warning(text);
};