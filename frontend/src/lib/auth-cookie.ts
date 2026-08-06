import { AUTH_TOKEN_COOKIE_KEY, USER_EMAIL_COOKIE_KEY, USER_NAME_COOKIE_KEY } from "@/constants/auth";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

/**
 * セットする Cookie の 1 件分の型定義
 */
export type CookieItem = {
  name: string
  value: string
  options?: Partial<ResponseCookie>
}

/**
 * 認証トークン（JWT等）を Cookie に保存する非同期関数
 *
 * @param token - Spring Boot から返却された認証トークン文字列
 * @returns Promise<void>
 *
 * @remarks
 * - XSS 対策のため `httpOnly: true` を設定し、クライアント JavaScript からの操作を防止します。
 * - 本番環境（`NODE_ENV === 'production'`）では HTTPS 通信時のみ送信されるよう `secure: true` を有効化します。
 * - アプリケーション全体の全パス（`/` 以下）で Cookie が送信されるよう `path: '/'` を設定しています。
 */
export const saveSessionCookie = async (cookieItems: CookieItem[]): Promise<void> => {
  const cookieStore = await cookies();

  for (const item of cookieItems) {
    cookieStore.set(item.name, item.value, {
      // サイト全体のすべてのパス（/以下）でこのCookieを有効化する
      // 例: /api/auth/loginでアクセスした場合、/api/auth/login 配下へのアクセス -> Cookie が送信される
      // /dashboard や /profile へのアクセス -> Cookie が送信されない（未ログイン扱いになる！）
      // となる場合を防止するため、ルート（/）をしてアプリ全体でCookie送信できるようにする
      path: '/',

      // 本番環境ではセキュア通信（https）を強制
      // [NODE_ENV]は開発環境実行（npm run dev）で `development` を自動設定
      // [NODE_ENV]は本番環境実行（npm run start）で `production` を自動設定
      secure: process.env.NODE_ENV === 'production',

      // 同一サイト、他サイトからのリンク遷移（GET）からはCookie送信
      sameSite: 'lax',

      // httpOnly 個別のオプション（httpOnly等）があれば上書き
      // 例：JavaScriptからのCoookieアクセス不可にする（XSS対策）
      ...item.options,
    })
  }
}

/**
 * 認証トークン Cookie を削除する非同期関数（ログアウト用）
 *
 * @returns Promise<void>
 */
export const deleteSessionCookie = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_TOKEN_COOKIE_KEY);
  cookieStore.delete(USER_EMAIL_COOKIE_KEY);
  cookieStore.delete(USER_NAME_COOKIE_KEY);
}

