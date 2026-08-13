package com.agency.sales.domain;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * パスワードリセット用トークン情報を表すエンティティドメインモデル。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetToken {
  /** トークンID (PK) */
  private Long id;

  /** 対象のアカウントID (FK: accounts.id) */
  private Long accountId;

  /** SHA-256でハッシュ化したトークン文字列 (Unique) */
  private String tokenHash;

  /** トークンの有効期限 */
  private LocalDateTime expiresAt;

  /** トークン使用日時（使用済みの場合は日時がセットされる） */
  private LocalDateTime usedAt;

  /** トークン発行日時 */
  private LocalDateTime createdAt;
}
