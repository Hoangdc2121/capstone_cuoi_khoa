import { API_CONFIG } from "@/config/api.config";
import { apiFetch, type ApiResponse } from "@/lib/api-fetch";
import type {
  SignInPayload,
  SignInResponse,
  SignUpPayload,
  SignUpResponse,
} from "@/app/(auth)/types/auth.type";

export const AuthService = {
  async signUp(payload: SignUpPayload): Promise<ApiResponse<SignUpResponse>> {
    const res = await apiFetch<ApiResponse<SignUpResponse>>(
      API_CONFIG.ENPOINTS.Auth.SIGN_UP,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    return res;
  },

  async signIn(payload: SignInPayload): Promise<ApiResponse<SignInResponse>> {
    const res = await apiFetch<ApiResponse<SignInResponse>>(
      API_CONFIG.ENPOINTS.Auth.SIGN_IN,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    return res;
  },
};
