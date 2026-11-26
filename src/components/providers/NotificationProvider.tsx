"use client";

import { App as AntdApp } from "antd";
import { useLayoutEffect, type ReactNode } from "react";
import { setMessageApi } from "@/utils/notification";

type NotificationProviderProps = {
  children: ReactNode;
};

export default function NotificationProvider({
  children,
}: NotificationProviderProps) {
  const { message } = AntdApp.useApp();

  useLayoutEffect(() => {
    setMessageApi(message);

    return () => {
      setMessageApi(null);
    };
  }, [message]);

  return children;
}
