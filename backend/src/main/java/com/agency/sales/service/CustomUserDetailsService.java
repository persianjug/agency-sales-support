package com.agency.sales.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.agency.sales.domain.Account;
import com.agency.sales.mapper.AccountMapper;

/**
 * Spring Security の認証処理において、ユーザー情報を DB から取得するためのカスタムサービス実装。
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {
  private final AccountMapper accountMapper;

  /**
   * コンストラクタ
   *
   * @param accountMapper アカウントマッパー
   */
  public CustomUserDetailsService(AccountMapper accountMapper) {
    this.accountMapper = accountMapper;
  }

  /**
   * ユーザー名キーでデータベースを検索し、Spring Security 用の UserDetails オブジェクトを構築します。
   *
   * @param username 検索対象のユーザー名
   * @return 認証情報を含む UserDetails オブジェクト
   * @throws UsernameNotFoundException 指定されたユーザー名のアカウントが存在しない場合
   */
  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    Account account = accountMapper.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("Account not found: " + username));

    return (
      User
        .withUsername(account.getUsername())
        .password(account.getPassword())
        .roles(account.getRole().name().replace("ROLE_", ""))
        .build()
    );
  }

}
