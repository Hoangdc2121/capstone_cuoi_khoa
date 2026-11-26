import "server-only";

import { NextResponse } from "next/server";

import { ApiFetchError } from "@/lib/api-fetch";
import { Fail } from "@/lib/api-response";

type Options = {
  errorCode: string;
  errorMessage: string;
  forwardUpstreamError?: boolean;
};

export async function handleApiRoute(
  handler: () => Promise<Response>,
  { errorCode, errorMessage, forwardUpstreamError = false }: Options,
): Promise<Response> {
  try {
    return await handler();
  } catch (error) {
    if (error instanceof ApiFetchError) {
      if (!forwardUpstreamError) {
        return Fail(errorCode, error.message, error.status);
      }

      const details = error.details;
      const body =
        typeof details === "object" && details !== null ? details : null;

      const message =
        body && "message" in body && typeof body.message === "string"
          ? body.message.trim()
          : "";

      const content = body && "content" in body ? body.content : null;

      const status =
        error.status >= 400 && error.status <= 599 ? error.status : 502;

      return NextResponse.json(
        {
          success: false,
          error: {
            code: errorCode,
            message: message || errorMessage,
          },
          data: content ?? null,
        },
        { status },
      );
    }

    return Fail("INTERNAL_ERROR", errorMessage, 500);
  }
}