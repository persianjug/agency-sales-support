package com.agency.sales.mapper;

import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;

import com.agency.sales.domain.PasswordResetToken;

/**
 * パスワードリセット用トークン情報 (password_reset_tokens テーブル) アクセス用 MyBatis マッパーインターフェース。
 */
@Mapper
public interface PasswordResetTokenMapper {

  /**
   * ハッシュ化されたトークン文字列に基づいてトークン情報を1件取得します。
   *
   * @param tokenHash 検索対象のハッシュ化トークン文字列
   * @return 該当トークン情報（存在しない場合は Optional.empty）
   */
  Optional<PasswordResetToken> findByTokenHash(String tokenHash);

  /**
   * パスワードリセット用トークン情報を新規登録します。
   * ID は DB 側で採番（Auto Increment / Serial）されます。
   *
   * @param token 登録用トークンドメインオブジェクト
   */
  void insert(PasswordResetToken token);

  /**
   * トークンの使用日時 (used_at) を更新し、使用済み状態にします。
   *
   * @param token 更新対象のトークンドメインオブジェクト
   */
  void updateUsedAt(PasswordResetToken token);

  /**
   * 指定されたアカウントIDに紐づく過去の未消費トークンをすべて物理削除します。
   *
   * @param accountId 対象のアカウントID
   */
  void deleteByAccountId(Long accountId);
}
