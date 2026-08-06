package  com.agency.sales.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * アカウント（ユーザー）情報を表すエンティティドメインモデル。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {
  /** アカウントID (PK) */
  private Long id;

  /** ユーザー名 (Unique) */
  private String username;

  /** 暗号化されたパスワード */
  private String password;

  /** アカウントのロール権限 */
  private Role role;

  /** ユーザー表示名 */
  private String name;
}
