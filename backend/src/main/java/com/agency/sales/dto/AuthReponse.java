package com.agency.sales.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * ログイン成功時にクライアントへ返却するレスポンス DTO。
 */
@Data
@AllArgsConstructor
public class AuthReponse {
  /** 発行された JWT トークン文字列 */
  private String token;
}
