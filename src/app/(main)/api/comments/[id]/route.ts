import { cookies } from "next/headers";

import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/app/(auth)/server/session";
import { CommentService } from "@/features/rooms/services/Comment.service";
import { Fail } from "@/lib/api-response";
import { handleApiRoute } from "@/lib/handle-api-route";

import { apiMutationResponse } from "@/lib/api-mutation-response";
type RouteContext = {
  params: Promise<{ id: string }>;
};

const updateOptions = {
  errorCode: "COMMENT_UPDATE_FAILED",
  errorMessage: "Không thể cập nhật bình luận.",
  successMessage: "Cập nhật bình luận thành công!",
  fallbackData: null,
  forwardUpstreamError: true,
};

const deleteOptions = {
  errorCode: "COMMENT_DELETE_FAILED",
  errorMessage: "Không thể xóa bình luận.",
  successMessage: "Xóa bình luận thành công!",
  forwardUpstreamError: true,
};

function parseCommentId(id: string): number | null {
  const commentId = Number(id);

  return /^[1-9]\d*$/.test(id) && Number.isSafeInteger(commentId)
    ? commentId
    : null;
}

async function getOwnedComment(commentId: number) {
  const cookieStore = await cookies();
  const session = await verifySessionToken(
    cookieStore.get(SESSION_COOKIE_NAME)?.value,
  );
  const token = cookieStore.get("accessToken")?.value;

  if (!session || !token) {
    return {
      ok: false,
      response: Fail(
        "UNAUTHORIZED",
        "Vui lòng đăng nhập để thực hiện thao tác này.",
        401,
      ),
    } as const;
  }

  const result = await CommentService.getAll();

  if (!Array.isArray(result.content)) {
    return {
      ok: false,
      response: Fail(
        "INVALID_DATA",
        "Dữ liệu danh sách bình luận không hợp lệ.",
        502,
      ),
    } as const;
  }

  const comment = result.content.find(
    (item) =>
      item !== null && typeof item === "object" && item.id === commentId,
  );

  if (!comment) {
    return {
      ok: false,
      response: Fail(
        "COMMENT_NOT_FOUND",
        "Bình luận không tồn tại hoặc đã bị xóa.",
        404,
      ),
    } as const;
  }

  if (comment.maNguoiBinhLuan !== session.userId) {
    return {
      ok: false,
      response: Fail(
        "FORBIDDEN",
        "Bạn chỉ có thể sửa hoặc xóa bình luận của mình.",
        403,
      ),
    } as const;
  }

  return {
    ok: true,
    comment,
    token,
    userId: session.userId,
  } as const;
}

export async function PUT(request: Request, { params }: RouteContext) {
  return handleApiRoute(async () => {
    const { id } = await params;
    const commentId = parseCommentId(id);

    if (commentId === null) {
      return Fail("INVALID_COMMENT_ID", "Mã bình luận không hợp lệ.", 400);
    }

    const ownedComment = await getOwnedComment(commentId);

    if (!ownedComment.ok) {
      return ownedComment.response;
    }

    let payload: unknown;

    try {
      payload = await request.json();
    } catch (error) {
      if (error instanceof SyntaxError) {
        return Fail("INVALID_JSON", "Dữ liệu JSON không hợp lệ.", 400);
      }

      throw error;
    }

    if (
      typeof payload !== "object" ||
      payload === null ||
      Array.isArray(payload)
    ) {
      return Fail("INVALID_INPUT", "Dữ liệu bình luận không hợp lệ.", 400);
    }

    const input = payload as Record<string, unknown>;
    const noiDung =
      typeof input.noiDung === "string" ? input.noiDung.trim() : "";
    const { saoBinhLuan } = input;

    if (!noiDung || noiDung.length > 2000) {
      return Fail(
        "INVALID_CONTENT",
        "Nội dung bình luận phải có từ 1 đến 2000 ký tự.",
        400,
      );
    }

    if (
      typeof saoBinhLuan !== "number" ||
      !Number.isInteger(saoBinhLuan) ||
      saoBinhLuan < 1 ||
      saoBinhLuan > 5
    ) {
      return Fail("INVALID_RATING", "Vui lòng chọn số sao từ 1 đến 5.", 400);
    }

    const result = await CommentService.update(
      commentId,
      {
        maPhong: ownedComment.comment.maPhong,
        maNguoiBinhLuan: ownedComment.userId,
        ngayBinhLuan: ownedComment.comment.ngayBinhLuan,
        noiDung,
        saoBinhLuan,
      },
      ownedComment.token,
    );

    return apiMutationResponse(result, updateOptions);
  }, updateOptions);
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  return handleApiRoute(async () => {
    const { id } = await params;
    const commentId = parseCommentId(id);

    if (commentId === null) {
      return Fail("INVALID_COMMENT_ID", "Mã bình luận không hợp lệ.", 400);
    }

    const ownedComment = await getOwnedComment(commentId);

    if (!ownedComment.ok) {
      return ownedComment.response;
    }

    const result = await CommentService.delete(commentId, ownedComment.token);

    return apiMutationResponse(result, {
      ...deleteOptions,
      fallbackData: { id: commentId },
    });
  }, deleteOptions);
}