package com.agency.sales.domain;

import lombok.Getter;

/**
 * ユーザー権限（ロール）を定義する Enum。
 */
@Getter
public enum Role {
  /** システム管理者権限 */
  ROLE_ADMIN("管理者"),

  /** 一般ユーザー権限 */
  ROLE_USER("一般ユーザー");

  /** 権限の概要日本語説明 */
  private final String description;

  Role(String description) {
    this.description = description;
  }
}
