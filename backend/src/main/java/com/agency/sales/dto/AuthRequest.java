package com.agency.sales.dto;

import lombok.Data;

/**
 * ログインAPI (`POST /api/v1/auth/login`) のリクエストボディ用 DTO。
 */
@Data
public class AuthRequest {
  /** ユーザー名 */
  private String username;

  /** パスワード（平文） */
  private String password;
}
