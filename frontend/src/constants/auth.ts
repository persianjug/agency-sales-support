// 認証トークンを保存する Cookie のキー名
export const AUTH_TOKEN_COOKIE_KEY = 'auth_token';

// 認証ユーザーのIDを保存する Cookie のキー名
export const USER_EMAIL_COOKIE_KEY = 'user_email';

// 認証ユーザーの名前を保存する Cookie のキー名
export const USER_NAME_COOKIE_KEY = 'user_name';

// 未ログイン状態でもアクセスを許可する公開パス
export const PUBLIC_PATHS = ['/login', '/signup'];

// パスに関する定数
export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  HOME: '/',
} as const;