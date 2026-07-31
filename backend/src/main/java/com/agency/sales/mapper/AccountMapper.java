package com.agency.sales.mapper;

import java.util.Optional;
import org.apache.ibatis.annotations.Mapper;
import com.agency.sales.domain.Account;

/**
 * アカウント情報 (accounts テーブル) アクセス用 MyBatis マッパーインターフェース。
 */
@Mapper
public interface AccountMapper {
  /**
   * ユーザー名に基づいてアカウント情報を1件取得します。
   *
   * @param username 検索対象のユーザー名
   * @return 該当アカウント（存在しない場合は Optional.empty）
   */
  Optional<Account> findByUsername(String username);

  /**
   * アカウント情報を新規登録します。
   * ID は DB 側で採番（Auto Increment）されます。
   *
   * @param account 登録用アカウントドメインオブジェクト
   */
  void insert(Account account);
}
