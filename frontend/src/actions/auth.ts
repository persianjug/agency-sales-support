'use server'

import { cookies } from 'next/headers';
import { authLoginSchema, AuthLoginFormValues } from '@/lib/validations/auth';
import { SpringBootAuthResponse, SpringBootErrorResponse, AuthLoginResult, } from '@/types/api/auth';
import { AUTH_MESSAGES } from '@/constants/messages';
import { AUTH_TOKEN_COOKIE_KEY } from '@/constants/auth';
import { apiClient } from '@/lib/api-Client';

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
const saveSessionCookie = async (token: string): Promise<void> => {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_TOKEN_COOKIE_KEY, token, {
    // JavaScriptからのCoookieアクセス不可にする（XSS対策）
    httpOnly: true,

    // 本番環境ではセキュア通信（https）を強制
    // [NODE_ENV]は開発環境実行（npm run dev）で `development` を自動設定
    // [NODE_ENV]は本番環境実行（npm run start）で `production` を自動設定
    secure: process.env.NODE_ENV === 'production',

    // 同一サイト、他サイトからのリンク遷移（GET）からはCookie送信
    sameSite: 'lax',

    // サイト全体のすべてのパス（/以下）でこのCookieを有効化する
    // 例: /api/auth/loginでアクセスした場合、/api/auth/login 配下へのアクセス -> Cookie が送信される
    // /dashboard や /profile へのアクセス -> Cookie が送信されない（未ログイン扱いになる！）
    // となる場合を防止するため、ルート（/）をしてアプリ全体でCookie送信できるようにする
    path: '/',
  })
}

/**
 * Spring Boot のログイン認証 API を呼び出す内部ヘルパー関数
 *
 * @param payload - API へ送信するログインフォーム値（`AuthLoginFormValues`）
 * @returns 成功時は `SpringBootAuthResponse`、失敗・エラー時は `SpringBootErrorResponse` を返却する Promise
 *
 * @remarks
 * - 通信完了後、ステータスコード（`response.ok`）で成功・失敗を判定します。
 * - HTTP エラー時、レスポンス JSON の解析に失敗した場合はフォールバックとしてデフォルトのエラーオブジェクトを生成します。
 */
const callLoginApi = async (
  payload: AuthLoginFormValues
): Promise<SpringBootAuthResponse | SpringBootErrorResponse> => {
  const endpoint = process.env.SPRING_BOOT_LOGIN_ENDPOINT;

  // email を username に変換して Spring Boot へ送信
  const requestBody = {
    username: payload.email,
    password: payload.password,
  };

  const response = await apiClient.post(endpoint, requestBody);

  if (!response.ok) {
    const errorData: SpringBootErrorResponse = await response
      .json()
      .catch(() => ({
        timestamp: '',
        status: response.status,
        error: 'UNKNOWN_ERROR',
        message: AUTH_MESSAGES.SERVER_ERROR,
      }));
    return errorData
  }

  const authData: SpringBootAuthResponse = await response.json();
  return authData;
}

/**
 * ユーザーログイン処理を行う Server Action
 *
 * @param data - ログインフォームから送信された入力値（`AuthLoginFormValues`）
 * @returns 処理結果オブジェクト（`AuthLoginResult`）
 *
 * @remarks
 * 処理手順:
 * 1. Zod スキーマ（`authLoginSchema`）を用いた入力値バリデーションチェック
 * 2. Spring Boot 側の認証 API 呼び出し（`callLoginApi`）
 * 3. 認証成功時、返却された JWT を Cookie へ保存（`saveSessionCookie`）
 * 4. 処理結果（成功 / 失敗フラグ、メッセージ）を呼出元へ返却
 */
export const authLoginAction = async (
  data: AuthLoginFormValues
): Promise<AuthLoginResult> => {

  // 1. バリデーションチェック
  const parsed = authLoginSchema.safeParse(data)
  if (!parsed.success) {
    return {
      success: false,
      message: AUTH_MESSAGES.VALIDATION_ERROR,
    }
  }

  try {
    // 2. SpringBoot API 呼び出し
    const apiResponse = await callLoginApi(data);

    // エラーレスポンスの場合（status プロパティを持っているか判定）
    if ('status' in apiResponse) {
      return {
        success: false,
        message: apiResponse.message || AUTH_MESSAGES.LOGIN_FAILED_DEFAULT,
      }
    }

    // 3. 正常系：Cookie にセッション（JWT）をセット
    await saveSessionCookie(apiResponse.token);

    return { success: true }
  } catch (error) {
    console.error('Login Action Error:', error);
    return {
      success: false,
      message: AUTH_MESSAGES.NETWORK_ERROR,
    }
  }
}
