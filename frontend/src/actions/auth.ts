'use server'

import { authLoginSchema, AuthLoginFormValues } from '@/lib/validations/auth';
import { SpringBootAuthResponse, SpringBootErrorResponse, AuthLoginResult, } from '@/types/api/auth';
import { AUTH_MESSAGES } from '@/constants/messages';
import { apiClient } from '@/lib/api-Client';
import { deleteSessionCookie, saveSessionCookie } from '@/lib/auth-cookie';
import { AUTH_TOKEN_COOKIE_KEY, USER_EMAIL_COOKIE_KEY, USER_NAME_COOKIE_KEY } from '@/constants/auth';

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

    console.log(`${JSON.stringify(Response)}`);

    // 3. 正常系：Cookie にセッション（JWT）をセット
    await saveSessionCookie([
      {
        name: AUTH_TOKEN_COOKIE_KEY,
        value: apiResponse.token,
        options: { httpOnly: true }, // JWT は JS から見えないよう保護
      },
      {
        name: USER_EMAIL_COOKIE_KEY,
        value: apiResponse.username,
        options: { httpOnly: false },
      },
      {
        name: USER_NAME_COOKIE_KEY,
        value: apiResponse.name,
        options: { httpOnly: false },
      },
    ]);

    return { success: true }
  } catch (error) {
    console.error('Login Action Error:', error);
    return {
      success: false,
      message: AUTH_MESSAGES.NETWORK_ERROR,
    }
  }
}

/**
 * ユーザーログアウト処理を行う Server Action
 *
 * @returns 処理結果オブジェクト
 *
 * @remarks
 * - Cookie 内の認証トークン（JWT）を削除（`deleteSessionCookie`）します。
 */
export const authLogoutAction = async () => {
  try {
    await deleteSessionCookie();
    return { success: true }
  } catch (error) {
    console.error('Logout Action Error:', error)
    return {
      success: false,
      message: AUTH_MESSAGES.NETWORK_ERROR,
    }
  }
}