package com.agency.sales.dto;

import lombok.Data;

/**
 * 新規アカウント登録（サインアップ）実行API (`POST /api/v1/auth/signup`) のリクエストボディ用 DTO。
 */
@Data
public class SignupRequest {
  /** ユーザー表示名 */
  private String name;

  /** ユーザー名（メールアドレス） */
  private String username;

  /** パスワード（平文） */
  private String password;
}
