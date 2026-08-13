package com.agency.sales.dto;

import java.util.Map;

import lombok.Builder;
import lombok.Getter;

/**
 * メール送信処理用のパラメータを保持する DTO。
 */
@Builder
@Getter
public class MailRequest {
  /** 送信元メールアドレス */
  private String from;

  /** 送信先メールアドレス */
  private String to;

  /** メール件名 */
  private String subject;

  /** メールテンプレートのパス（例: "mail/reset-password"） */
  private String templatePath;

  /** テンプレートエンジン（Thymeleaf）に渡す変数マップ */
  private Map<String, Object> variables;
}
