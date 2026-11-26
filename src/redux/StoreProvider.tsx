"use client";

import { AppStore, makeStore } from "@/redux/store";
import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import AuthInitializer from "../app/(auth)/components/AuthInitializer";

type Props = {
  children: ReactNode;
};

export default function StoreProvider({ children }: Props) {
  const [store] = useState<AppStore>(makeStore);

  return (
    <Provider store={store}>
      {" "}
      <AuthInitializer /> {children}
    </Provider>
  );
}
