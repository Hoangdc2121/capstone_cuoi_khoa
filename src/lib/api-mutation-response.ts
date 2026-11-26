import "server-only";

import { NextResponse } from "next/server";

import { Ok } from "@/lib/api-response";

type ApiMutationResult = {
  statusCode?: number;
  message?: unknown;
  content?: unknown;
};

type ApiMutationOptions = {
  errorCode: string;
  errorMessage: string;
  successMessage: string;
  fallbackData: unknown;
};

export function apiMutationResponse(
  result: ApiMutationResult | null | undefined,
  options: ApiMutationOptions,
) {
  const statusCode = result?.statusCode;
  const rawMessage = result?.message;
  const message =
    typeof rawMessage === "string" && rawMessage.trim()
      ? rawMessage
      : undefined;

  if (
    typeof statusCode === "number" &&
    Number.isInteger(statusCode) &&
    statusCode >= 400 &&
    statusCode <= 599
  ) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: options.errorCode,
          message: message ?? options.errorMessage,
        },
        data: result?.content ?? null,
      },
      { status: statusCode },
    );
  }

  return Ok(
    result?.content ?? options.fallbackData,
    undefined,
    message ?? options.successMessage,
  );
}