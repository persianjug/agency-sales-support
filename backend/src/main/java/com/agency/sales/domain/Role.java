package com.agency.sales.domain;

import lombok.Getter;

/**
 * ユーザー権限（ロール）を定義する Enum。
 */
@Getter
public enum Role {
  ROLE_SOLICITOR("0001", "募集人"),
  ROLE_AGENCY_ADMIN("0002", "代理店管理者"),
  ROLE_HQ_STAFF("0003", "本部スタッフ"),
  ROLE_SYSTEM_ADMIN("0004", "システム管理者"),
  ROLE_USER("0009","一般ユーザー");

  // SOLICITOR("ROLE_SOLICITOR", "スタッフ（一般ユーザー）"),
  // AGENCY_ADMIN("ROLE_AGENCY_ADMIN", "代理店管理者"),
  // HQ_STAFF("ROLE_HQ_STAFF", "本部スタッフ"),
  // SYSTEM_ADMIN("ROLE_SYSTEM_ADMIN", "システム管理者");

  /** 権限コード（画面表示・マッピング用） */
  private final String code;

  /** 権限の概要日本語説明 */
  private final String description;

  Role(String code, String description) {
    this.code = code;
    this.description = description;
  }
}
