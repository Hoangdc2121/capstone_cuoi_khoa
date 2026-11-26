"use client";

import { useId } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

import AppButton from "@/components/common/AppButton";
import Container from "@/components/common/Container";
import Reveal from "@/components/common/Reveal";

import StayDatePicker from "../../(home)/components/hero-search/StayDatePicker/StayDatePicker";
import GuestPicker from "../../(home)/components/hero-search/GuestPicker/GuestPicker";
import useExploreSearch from "../hooks/useExploreSearch";

import {
  searchPanelClassName,
  searchTriggerClassName,
  searchPopupClassName,
} from "@/features/stay-search/styles/search.styles";

export default function ExploreSearch() {
  const searchParams = useSearchParams();

  const formKey = JSON.stringify([
    searchParams.get("checkIn"),
    searchParams.get("checkOut"),
    searchParams.get("guests"),
  ]);

  return <ExploreSearchForm key={formKey} />;
}

function ExploreSearchForm() {
  const id = useId();

  const {
    guestsOpen,
    setGuestsOpen,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    guests,
    setGuests,
    errors,
    clearError,
    changeGuests,
    handleSubmit,
  } = useExploreSearch();

  return (
    <Container className="pointer-events-none relative z-20 -mt-6 sm:-mt-8 lg:-mt-28">
      <Reveal
        animation="up"
        delay={0.6}
        duration={0.7}
        className="mx-auto w-full max-w-3xl"
      >
        <form
          role="search"
          aria-label="Tìm chỗ ở theo ngày và số khách"
          noValidate
          onSubmit={handleSubmit}
          className="pointer-events-auto w-full"
        >
          <div className={searchPanelClassName}>
            <div className="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] lg:items-center">
              {/* Ngày lưu trú — ô đầu tiên không có đường kẻ. */}
              <div className="min-w-0 [&>div]:border-0">
                <StayDatePicker
                  variant="hero"
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
      </Reveal>
    </Container>
  );
}
