/**
 * Spring Boot の認証成功時に返却されるレスポンス（DTO）の型定義
 */
export type SpringBootAuthResponse = {
  /** 認証トークン（JWT等） */
  token: string,
  /** ユーザーID（メールアドレス) */
  username: string,
  /** ユーザー名 */
  name: string,
}

/**
 * Spring Boot でエラー発生時に返却される標準レスポンス（DTO）の型定義
 */
export type SpringBootErrorResponse = {
  /** エラーが発生したタイムスタンプ（例: "2026-08-04T09:57:26.000+00:00"） */
  timestamp: string,
  /** HTTP ステータスコード（例: 400, 401, 500） */
  status: number,
  /** エラー種別コード / エラー名（例: "UNAUTHORIZED"） */
  error: string,
  /** ユーザー向けまたは詳細なエラーメッセージ */
  message: string,
}

/**
 * フロントエンド（Server Action / コンポーネント）側で扱うログイン処理結果の型定義
 */
export type AuthLoginResult = {
  /** ログイン処理が成功したかどうか */
  success: boolean,
  /** エラーメッセージ（失敗時のみセットされる / 任意） */
  message?: string,
}

/**
 * フロントエンド（Server Action / コンポーネント）側で扱うサインアップ処理結果の型定義
 */
export type AuthSignupResult = {
  /** ログイン処理が成功したかどうか */
  success: boolean,
  /** エラーメッセージ（失敗時のみセットされる / 任意） */
  message?: string,
}

/**
 * フロントエンド側で扱うパスワード変更処理結果の型定義
 */
export type AuthChangePasswordResult = {
  /** 処理が成功したかどうか */
  success: boolean;
  /** エラーメッセージ（失敗時のみセットされる） */
  message?: string;
};


/**
 * パスワード変更 API のリクエストボディ型定義
 */
export type SpringBootChangePasswordRequest = {
  /** 現在のパスワード */
  currentPassword: string;
  /** 新しいパスワード */
  newPassword: string;
};

/**
 * パスワード忘れ申請 API のリクエストボディ型定義
 */
export type SpringBootForgotPasswordRequest = {
  /** ユーザー名（メールアドレス） */
  username: string;
};

/**
 * パスワード再設定 API のリクエストボディ型定義
 */
export type SpringBootResetPasswordRequest = {
  /** ワンタイムトークン */
  token: string;
  /** 新しいパスワード */
  newPassword: string;
};

/**
 * パスワード忘れ申請処理結果の型定義
 */
export type AuthForgotPasswordResult = {
  /** 処理が成功したかどうか */
  success: boolean;
  /** エラーメッセージ（失敗時のみセットされる） */
  message?: string;
}

/**
 * パスワード再設定処理結果の型定義
 */
export type AuthResetPasswordResult = {
  /** 処理が成功したかどうか */
  success: boolean;
  /** エラーメッセージ（失敗時のみセットされる） */
  message?: string;
}