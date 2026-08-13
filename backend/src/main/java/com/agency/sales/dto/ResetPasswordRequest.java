package com.agency.sales.dto;

import lombok.Data;

/**
 * パスワード再設定実行API (`POST /api/v1/auth/reset-password`) のリクエストボディ用 DTO。
 */
@Data
public class ResetPasswordRequest {
  /** 再設定用トークン（メール通知された生トークン） */
  private String token;

  /** 新しいパスワード（平文） */
  private String newPassword;
}