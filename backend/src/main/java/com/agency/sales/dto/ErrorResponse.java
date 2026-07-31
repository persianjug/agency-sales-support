package com.agency.sales.dto;

import java.time.ZonedDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Builder;
import lombok.Data;

/**
 * API エラー発生時に返却される統一フォーマットのレスポンス DTO。
 */
@Data
@Builder
public class ErrorResponse {
  /** エラー発生時刻 (日本時間・ISO-8601形式) */
  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", timezone = "Asia/Tokyo")
  private ZonedDateTime timestamp;

  /** HTTP ステータスコード (例: 401, 500) */
  private int status;

  /** エラー種別識別子 (例: "UNAUTHORIZED") */
  private String error;

  /** ユーザー向けエラー詳細メッセージ */
  private String message;
}
