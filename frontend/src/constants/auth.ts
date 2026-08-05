// 認証トークンを保存する Cookie のキー名
export const AUTH_TOKEN_COOKIE_KEY = 'auth_token';

// 未ログイン状態でもアクセスを許可する公開パス
export const PUBLIC_PATHS = ['/login', '/register'];

// パスに関する定数
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  HOME: '/',
} as const;