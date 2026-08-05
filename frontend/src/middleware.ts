import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_TOKEN_COOKIE_KEY, PUBLIC_PATHS, ROUTES } from '@/constants/auth';


/**
 * ミドルウェアを適用するルーティングを設定する config オブジェクト
 *
 * @remarks
 * 静的ファイルや API ルートなどを除外し、ページの認証ハンドリングが必要なパスにのみミドルウェアを実行させます。
 * 静的ファイルなどを除外するための正規表現パターン
 * （※ Next.jsの仕様上、同一ファイル内または config 内に記述する必要がある）
 * 以下で始まるパス以外すべてに適用:
 * - api (API routes)
 * - _next/static (static files)
 * - _next/image (image optimization files)
 * - favicon.ico, images など
 */
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
}

/**
 * アプリケーション全体の認証状態とルーティングを検証・制御する Next.js ミドルウェア
 *
 * @param request - クライアントからのリクエストオブジェクト（`NextRequest`）
 * @returns 判定結果に応じたレスポンスオブジェクト（リダイレクト `NextResponse.redirect` または通過 `NextResponse.next`）
 *
 * @remarks
 * 制御ロジック:
 * 1. Cookie から認証トークンを取得します。
 * 2. アクセス先のパスが公開パス（`PUBLIC_PATHS`）か保護されたパスかを判定します。
 * 3. 未ログインかつ保護パスへのアクセスの場合は、元のパスを `from` クエリパラメータに保持させてログイン画面へリダイレクトします。
 * 4. ログイン済みかつ公開パス（ログイン画面等）へのアクセスの場合は、ホーム画面へリダイレクトします。
 * 5. それ以外の場合はそのままリクエストを通します。
 */
export const middleware = (request: NextRequest) => {
  // ドメイン以降のパス取得（例：/loginなど）
  const { pathname } = request.nextUrl;

  // Cookieからトークン取得
  const token = request.cookies.get(AUTH_TOKEN_COOKIE_KEY)?.value;

  // console.log(`[Middleware] Path: ${pathname}, Token exists: ${!!token}`);

  // ドメイン以降のパスが未ログイン状態でもアクセスを許可する公開パスに該当するか？
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // 未ログイン状態 ＆ 保護されたページへアクセスした場合
  //  -> /login へ飛ばす -> ログイン後、指定したページへ自動的に飛ばす
  // パスの例: /login?from=/settings/profile
  if (!token && !isPublicPath) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ログイン済み状態 ＆ /login などの公開ページへアクセスした場合
  // -> メイン画面（/）へ飛ばす
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
  }

  // ログイン済み状態 ＆　保護されたページにアクセスした場合
  // 未ログイン状態 ＆ 公開ページにアクセスした場合
  // -> 指定したページへ飛ばす
  return NextResponse.next();
}
