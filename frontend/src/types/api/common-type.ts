/**
 * 保有資格項目
 */
export type Certification = {
  /** 資格識別コード */
  certificationCode: number;
  /** 資格名称 */
  name: string;
};

/**
 * 得意分野項目
 */
export type Specialty = {
  /** 得意分野識別コード */
  specialtyCode: number;
  /** 分野名称 */
  name: string;
};


/**
 * APIから成功時に返却される汎用レスポンス（DTO）の型定義
 */
export type SuccessApiResponse = {
  message: string;
};

/**
 * APIからエラー時に返却される汎用レスポンス（DTO）の型定義
 */
export type ErrorApiResponse = {
  /** エラーが発生したタイムスタンプ（例: "2026-08-04T09:57:26.000+00:00"） */
  timestamp: string,
  /** HTTP ステータスコード（例: 400, 401, 500） */
  status: number,
  /** エラー種別コード / エラー名（例: "UNAUTHORIZED"） */
  error: string,
  /** ユーザー向けまたは詳細なエラーメッセージ */
  message: string,
};

/**
 * Server Actions の処理結果
 */
export type ActionsResult = {
  /** 処理が成功したかどうか */
  success: boolean;
  /** エラーメッセージ（失敗時のみセット） */
  message?: string;
};
