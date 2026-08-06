package com.agency.sales.security;

import java.util.Collection;
import java.util.List;

import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.agency.sales.domain.Account;

import lombok.Getter;

/**
 * Spring Security で使用するユーザー詳細情報クラス。
 * 
 * {@link UserDetails} インターフェースを実装し、アプリケーション固有の {@link Account} データを保持します。
 * 認証成功後、セキュリティコンテキストからアカウント情報（IDや表示名など）を容易に取得できるようにします。
 */
@Getter
public class CustomUserDetails implements UserDetails {

  /** 保持するアカウントドメインモデル */
  private final Account account;

  /**
   * コンストラクタ
   *
   * @param account アカウントエンティティ
   */
  public CustomUserDetails(Account account) {
    this.account = account;
  }

  /**
   * ユーザーIDを取得するショートカットメソッド。
   *
   * @return アカウントID
   */
  public Long getId() {
    return account.getId();
  }

  /**
   * ユーザーの表示名を取得するショートカットメソッド。
   *
   * @return ユーザー表示名
   */
  public String getName() {
    return account.getName();
  }

  /**
   * ユーザーに付与されている権限リストを取得します。
   *
   * @return 権限コレクション
   */
  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority(account.getRole().name()));
  }

  /**
   * ユーザーの暗号化されたパスワードを取得します。
   *
   * @return パスワード文字列
   */
  @Override
  public @Nullable String getPassword() {
    return account.getPassword();
  }

  /**
   * ユーザーの識別名（ログインID・メールアドレス）を取得します。
   *
   * @return ユーザー名
   */
  @Override
  public String getUsername() {
    return account.getUsername();
  }

  /**
   * アカウントの有効期限が切れていないかを判定します。
   *
   * @return 有効な場合は {@code true}
   */
  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  /**
   * アカウントがロックされていないかを判定します。
   *
   * @return ロックされていない場合は {@code true}
   */
  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  /**
   * 資格情報（パスワード）の有効期限が切れていないかを判定します。
   *
   * @return 有効な場合は {@code true}
   */
  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  /**
   * アカウントが有効であるかを判定します。
   *
   * @return 有効な場合は {@code true}
   */
  @Override
  public boolean isEnabled() {
    return true;
  }
}
