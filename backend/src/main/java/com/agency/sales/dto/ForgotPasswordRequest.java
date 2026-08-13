package com.agency.sales.dto;

import lombok.Data;

/**
 * パスワード再設定申請API (`POST /api/v1/auth/forgot-password`) のリクエストボディ用 DTO。
 */
@Data
public class ForgotPasswordRequest {
  /** ユーザー名（メールアドレス） */
  private String username;
}