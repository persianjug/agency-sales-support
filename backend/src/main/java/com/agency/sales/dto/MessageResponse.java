package com.agency.sales.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 汎用的なメッセージ返却用 DTO。
 */
@Data
@AllArgsConstructor
public class MessageResponse {
  /** 処理結果メッセージ */
  private String message;
}
