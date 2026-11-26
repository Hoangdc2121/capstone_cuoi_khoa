"use client";

import type { FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import useStaySearch from "@/features/stay-search/hooks/useStaySearch";

export default function useExploreSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const staySearch = useStaySearch({
    checkIn: searchParams.get("checkIn") ?? "",
    checkOut: searchParams.get("checkOut") ?? "",
    guests: searchParams.get("guests") ?? "2",
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!staySearch.validate()) return;

    const params = new URLSearchParams(searchParams.toString());

    params.delete("destinationId");
    params.delete("page");

    params.set("checkIn", staySearch.checkIn);
    params.set("checkOut", staySearch.checkOut);
    params.set("guests", String(Number(staySearch.guests)));

    staySearch.setGuestsOpen(false);

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  }

  return {
    ...staySearch,
    handleSubmit,
  };
}