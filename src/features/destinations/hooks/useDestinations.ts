"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchDestinations } from "../store/slice/destinationSlice";

export default function useDestinations(enabled: boolean) {
  const dispatch = useAppDispatch();

  const { items, status, error } = useAppSelector(
    (state) => state.destinations,
  );

  useEffect(() => {
    if (enabled && status === "idle") {
      void dispatch(fetchDestinations());
    }
  }, [enabled, status, dispatch]);

  function retry() {
    if (!enabled) {
      return;
    }

    void dispatch(fetchDestinations());
  }
  return {
    destinations: items,
    loading: enabled && (status === "idle" || status === "loading"),
    error,
    retry,
  };
}
