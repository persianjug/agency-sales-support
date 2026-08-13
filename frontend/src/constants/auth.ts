// 認証トークンを保存する Cookie のキー名
export const AUTH_TOKEN_COOKIE_KEY = 'auth_token';

// 認証ユーザーのIDを保存する Cookie のキー名
export const USER_EMAIL_COOKIE_KEY = 'user_email';

// 認証ユーザーの名前を保存する Cookie のキー名
export const USER_NAME_COOKIE_KEY = 'user_name';

// パスに関する定数
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  CHANGE_PASSWORD: '/change-password',
} as const;

// 未ログイン状態でもアクセスを許可する公開パス
export const PUBLIC_PATHS = [
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
];

// パスワード強度の設定マップ
export type StrengthConfig = {
  label: string;
  color: string;
  textColor: string;
};

// 未入力時の表示設定
export const EMPTY_STRENGTH_CONFIG: StrengthConfig = {
  label: "未入力",
  color: "bg-muted",
  textColor: "text-muted-foreground",
} as const;

export const STRENGTH_MAP: Record<number, StrengthConfig> = {
  0: { label: "非常に弱い", color: "bg-red-400", textColor: "text-red-400" },
  1: { label: "弱い", color: "bg-red-500", textColor: "text-red-500" },
  2: { label: "普通", color: "bg-yellow-500", textColor: "text-yellow-600" },
  3: { label: "強い", color: "bg-emerald-500", textColor: "text-emerald-600" },
  4: { label: "非常に強い", color: "bg-blue-600", textColor: "text-blue-600" },
} as const;
