"use client";

import { useId } from "react";
import { History, Search } from "lucide-react";

import AppButton from "@/components/common/AppButton";
import useHeroSearch from "../../hooks/useHeroSearch";

import DestinationPicker from "./destinations/DestinationPicker/DestinationPicker";
import StayDatePicker from "./StayDatePicker/StayDatePicker";
import GuestPicker from "./GuestPicker/GuestPicker";

import {
  searchPanelClassName,
  searchTriggerClassName,
  searchPopupClassName,
} from "@/features/stay-search/styles/search.styles";

function formatDate(value: string) {
  return value.split("-").reverse().join("/");
}

export default function HeroSearch() {
  const id = useId();

  const {
    destination,
    setDestination,
    destinationOpen,
    setDestinationOpen,
    guestsOpen,
    setGuestsOpen,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    guests,
    setGuests,
    errors,
    history,
    selectHistory,
    clearHistory,
    clearError,
    changeGuests,
    handleSubmit,
  } = useHeroSearch();

  return (
    <div className="mx-auto w-full lg:max-w-4xl">
      <form
        role="search"
        aria-label="Tìm kiếm chỗ ở"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className={searchPanelClassName}>
          <div className="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-center">
            {/* Địa điểm. */}
            <div className="min-w-0">
              <DestinationPicker
                id={`${id}-destination`}
                value={destination}
                open={destinationOpen}
                error={errors.destination}
                onOpenChange={setDestinationOpen}
                onChange={(value) => {
                  setDestination(value);
                  clearError("destination");
                }}
                triggerClassName={searchTriggerClassName}
              />
            </div>

            {/* Ngày lưu trú. */}
            <div className="min-w-0">
              <StayDatePicker
                error={errors.checkIn || errors.checkOut}
                value={{ checkIn, checkOut }}
                onChange={(value) => {
                  setCheckIn(value.checkIn);
                  setCheckOut(value.checkOut);

                  clearError("checkIn");
                  clearError("checkOut");
                }}
              />
            </div>

            {/* Số khách. */}
            <div className="min-w-0">
              <GuestPicker
                id={`${id}-guests`}
                value={guests}
                open={guestsOpen}
                error={errors.guests}
                onOpenChange={setGuestsOpen}
                onChange={(value) => {
                  setGuests(value);
                  clearError("guests");
                }}
                onStep={changeGuests}
                triggerClassName={searchTriggerClassName}
                popupClassName={searchPopupClassName}
              />
            </div>

            {/* Tìm kiếm. */}
            <div className="mt-3 min-w-0 lg:mt-0 lg:pl-2">
              <AppButton
                htmlType="submit"
                className="flex! h-12! w-full! items-center! justify-center! gap-2! rounded-2xl! px-5! lg:h-11! lg:w-auto! lg:rounded-full! lg:px-7!"
              >
                <Search size={20} aria-hidden="true" />

                <span className="text-sm font-semibold">Tìm chỗ ở</span>
              </AppButton>
            </div>
          </div>
        </div>
      </form>

      {/* Lịch sử tìm kiếm. */}
      {history.length > 0 && (
        <section
          aria-labelledby={`${id}-history-title`}
          className="mt-4 rounded-2xl border border-border bg-card p-4 text-left text-card-foreground shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <h2
              id={`${id}-history-title`}
              className="m-0! flex items-center gap-2 text-sm! font-semibold!"
            >
              Tìm kiếm gần đây
            </h2>

            <button
              type="button"
              onClick={clearHistory}
              className="min-h-10 shrink-0 cursor-pointer rounded-lg px-2 text-xs text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-2 focus-visible:outline-ring"
            >
              Xóa lịch sử
            </button>
          </div>

          <ul className="m-0! mt-3! grid list-none gap-2 p-0! sm:grid-cols-2">
            {history.map((item) => (
              <li
                key={JSON.stringify([
                  item.destinationId,
                  item.checkIn,
                  item.checkOut,
                  item.guests,
                ])}
                className="min-w-0"
              >
                <button
                  type="button"
                  onClick={() => selectHistory(item)}
                  className="flex h-full w-full min-w-0 cursor-pointer items-start gap-3 rounded-xl border border-border p-3 text-left transition-colors hover:border-primary hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <History
                    size={17}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-muted-foreground"
                  />

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {item.destination}
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                      {formatDate(item.checkIn)}
                      {" → "}
                      {formatDate(item.checkOut)}
                      {" · "}
                      {item.guests} khách
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
