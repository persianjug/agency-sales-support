package com.agency.sales.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * ログイン成功時にクライアントへ返却するレスポンス DTO。
 */
@Data
@AllArgsConstructor
public class AuthResponse {
  /** 発行された JWT トークン文字列 */
  private String token;

  /** ユーザーID（メールアドレス） */
  private String username;

  /** ユーザー表示名 */
  private String name;
}
