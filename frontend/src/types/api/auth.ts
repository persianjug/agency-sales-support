/**
 * Spring Boot の認証成功時に返却されるレスポンス（DTO）の型定義
 */
export type SpringBootAuthResponse = {
  /** 認証トークン（JWT等） */
  token: string
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
