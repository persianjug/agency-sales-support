package com.agency.sales.dto;

import lombok.Data;

@Data
public class SignupRequest {
  /** ユーザー表示名 */
  private String name;

  /** ユーザー名（メールアドレス） */
  private String username;

  /** パスワード（平文） */
  private String password;
}
