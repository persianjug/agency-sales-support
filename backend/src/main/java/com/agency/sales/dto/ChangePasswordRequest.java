package com.agency.sales.dto;

import lombok.Data;

/**
 * パスワード変更実行API (`POST /api/v1/auth/change-password`) のリクエストボディ用 DTO。
 */
@Data
public class ChangePasswordRequest {
  /** ユーザー名（メールアドレス） */
  private String username;

  /** 現在パスワード（平文） */
  private String currentPassword;

  /** 新パスワード（平文） */
  private String newPassword;
}
