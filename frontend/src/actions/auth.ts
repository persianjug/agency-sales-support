'use server'

import { authLoginSchema, AuthLoginFormValues, AuthSignupFormValues, authSignupSchema, AuthChangePasswordFormValues, authChangePasswordSchema, AuthForgotPasswordFormValues, authForgotPasswordSchema, AuthResetPasswordFormValues, authResetPasswordSchema } from '@/lib/validations/auth';
import { SpringBootAuthResponse, SpringBootErrorResponse, AuthLoginResult, AuthSignupResult, AuthChangePasswordResult, AuthForgotPasswordResult, AuthResetPasswordResult, } from '@/types/api/auth';
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

/**
 * Spring Boot のサインアップ API を呼び出す内部ヘルパー関数
 *
 * @param payload - API へ送信するサインアップフォーム値（`AuthSignupFormValues`）
 * @returns 成功時は `SpringBootAuthResponse`、失敗・エラー時は `SpringBootErrorResponse` を返却する Promise
 */
const callSignupApi = async (
  payload: AuthSignupFormValues
): Promise<SpringBootAuthResponse | SpringBootErrorResponse> => {
  const endpoint = process.env.SPRING_BOOT_SIGNUP_ENDPOINT;

  // email を username に変換、name と password を含めて Spring Boot へ送信
  const requestBody = {
    name: payload.name,
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
    return errorData;
  }

  const authData: SpringBootAuthResponse = await response.json();
  return authData;
};

/**
 * ユーザー新規登録（サインアップ）処理を行う Server Action
 *
 * @param data - サインアップフォームから送信された入力値（`AuthSignupFormValues`）
 * @returns 処理結果オブジェクト（`AuthSignupResult`）
 *
 * @remarks
 * 処理手順:
 * 1. Zod スキーマ（`authSignupSchema`）を用いた入力値バリデーションチェック
 * 2. Spring Boot 側のサインアップ API 呼び出し（`callSignupApi`）
 * 3. 登録成功時、返却された JWT・ユーザー情報を Cookie へ保存（`saveSessionCookie`）して自動ログイン状態にする
 * 4. 処理結果（成功 / 失敗フラグ、メッセージ）を呼出元へ返却
 */
export const authSignupAction = async (
  data: AuthSignupFormValues
): Promise<AuthSignupResult> => {

  // 1. バリデーションチェック
  const parsed = authSignupSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: AUTH_MESSAGES.VALIDATION_ERROR,
    };
  }

  try {
    // 2. SpringBoot API 呼び出し
    const apiResponse = await callSignupApi(data);

    // エラーレスポンスの場合（status プロパティを持っているか判定）
    if ('status' in apiResponse) {
      return {
        success: false,
        message: apiResponse.message || 'アカウント登録に失敗しました',
      };
    }

    // 3. 正常系：Cookie にセッション（JWT）をセットして自動ログイン状態にする
    await saveSessionCookie([
      {
        name: AUTH_TOKEN_COOKIE_KEY,
        value: apiResponse.token,
        options: { httpOnly: true },
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

    return { success: true };
  } catch (error) {
    console.error('Signup Action Error:', error);
    return {
      success: false,
      message: AUTH_MESSAGES.NETWORK_ERROR,
    };
  }
}

/**
 * Spring Boot のパスワード変更 API を呼び出す内部ヘルパー関数
 *
 * @param email -  Server Component から親コンポーネント経由で渡されるメールアドレス
 * @param payload - API へ送信するパスワード変更フォーム値（`AuthChangePasswordFormValues`）
 * @returns 成功時は `{ ok: true }`、失敗・エラー時は `SpringBootErrorResponse` を返却する Promise
 */
const callChangePasswordApi = async (
  email: string,
  payload: AuthChangePasswordFormValues
): Promise<SpringBootAuthResponse | SpringBootErrorResponse> => {
  const endpoint = process.env.SPRING_BOOT_CHANGE_PASSWORD_ENDPOINT;

  const requestBody = {
    username: email,
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
  };

  // apiClient が認証トークン（Cookie等）を自動付与して送信する想定
  const response = await apiClient.put(endpoint, requestBody);

  if (!response.ok) {
    const errorData: SpringBootErrorResponse = await response
      .json()
      .catch(() => ({
        timestamp: '',
        status: response.status,
        error: 'UNKNOWN_ERROR',
        message: AUTH_MESSAGES.SERVER_ERROR,
      }));
    return errorData;
  }

  const authData: SpringBootAuthResponse = await response.json();
  return authData;
};

/**
 * パスワード変更処理を行う Server Action
 *
 * @param email -  Server Component から親コンポーネント経由で渡されるメールアドレス
 * @param data - パスワード変更フォームから送信された入力値（`AuthChangePasswordFormValues`）
 * @returns 処理結果オブジェクト（`AuthChangePasswordResult`）
 *
 * @remarks
 * 処理手順:
 * 1. Zod スキーマ（`authChangePasswordSchema`）を用いた入力値バリデーションチェック
 * 2. Spring Boot 側のパスワード変更 API 呼び出し（`callChangePasswordApi`）
 * 3. 処理結果（成功 / 失敗フラグ、メッセージ）を呼出元へ返却
 */
export const authChangePasswordAction = async (
  email: string,
  data: AuthChangePasswordFormValues
): Promise<AuthChangePasswordResult> => {

  // 1. バリデーションチェック
  const parsed = authChangePasswordSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: AUTH_MESSAGES.VALIDATION_ERROR,
    };
  }

  try {
    // 2. Spring Boot API 呼び出し
    const apiResponse = await callChangePasswordApi(email, data);

    // エラーレスポンスの場合（status プロパティを持っているか判定）
    if ('status' in apiResponse) {
      return {
        success: false,
        message: apiResponse.message || 'パスワードの変更に失敗しました',
      };
    }

    // 成功したらセッション（JWT）を保存してそのまま自動ログイン状態にする
    await saveSessionCookie([
      {
        name: AUTH_TOKEN_COOKIE_KEY,
        value: apiResponse.token,
        options: { httpOnly: true },
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

    return { success: true };
  } catch (error) {
    console.error('Change Password Action Error:', error);
    return {
      success: false,
      message: AUTH_MESSAGES.NETWORK_ERROR,
    };
  }
}

/**
 * Spring Boot のパスワード再設定用メールの送信要求 API を呼び出す内部ヘルパー関数
 *
 * @param payload - API へ送信するパスワード再設定用メールの送信要求フォーム値（`AuthForgotPasswordFormValues`）
 * @returns 成功時は `{ ok: true }`、失敗・エラー時は `SpringBootErrorResponse` を返却する Promise
 */
const callForgotPasswordApi = async (
  payload: AuthForgotPasswordFormValues
): Promise<SpringBootAuthResponse | SpringBootErrorResponse> => {
  const endpoint = process.env.SPRING_BOOT_FORGOT_PASSWORD_ENDPOINT;

  const requestBody = {
    username: payload.email,
  };

  // apiClient が認証トークン（Cookie等）を自動付与して送信する想定
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
    return errorData;
  }

  const authData: SpringBootAuthResponse = await response.json();
  return authData;
};

/**
 * パスワード再設定用メールの送信要求を行う Server Action
 *
 * @param data - パスワード再設定用フォームから送信された入力値（`AuthForgotPasswordFormValues`）
 * @returns 処理結果オブジェクト（`AuthForgotPasswordResult`）
 *
 * @remarks
 * 処理手順:
 * 1. Zod スキーマ（`authForgotPasswordSchema`）を用いた入力値バリデーションチェック
 * 2. Spring Boot 側のパスワード変更 API 呼び出し（`callForgotPasswordApi`）
 * 3. 処理結果（成功 / 失敗フラグ、メッセージ）を呼出元へ返却
 */
export const authForgotPasswordAction = async (
  data: AuthForgotPasswordFormValues
): Promise<AuthForgotPasswordResult> => {

  // 1. バリデーションチェック
  const parsed = authForgotPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: AUTH_MESSAGES.VALIDATION_ERROR,
    };
  }

  try {
    // 2. Spring Boot API 呼び出し
    const apiResponse = await callForgotPasswordApi(data);

    // エラーレスポンスの場合（status プロパティを持っているか判定）
    if ('status' in apiResponse) {
      return {
        success: false,
        message: apiResponse.message || 'パスワード再設定用メールの送信要求に失敗しました',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Forgot Password Action Error:', error);
    return {
      success: false,
      message: AUTH_MESSAGES.NETWORK_ERROR,
    };
  }
}

/**
 * Spring Boot のパスワード再設定処理 API を呼び出す内部ヘルパー関数
 *
 * @param token - パスワード再設定用のワンタイムトークン
 * @param payload - API へ送信するパスワード再設定処理フォーム値（`AuthResetPasswordFormValues`）
 * @returns 成功時は `{ ok: true }`、失敗・エラー時は `SpringBootErrorResponse` を返却する Promise
 */
const callResetPasswordApi = async (
  token: string,
  payload: AuthResetPasswordFormValues
): Promise<SpringBootAuthResponse | SpringBootErrorResponse> => {
  const endpoint = process.env.SPRING_BOOT_RESET_PASSWORD_ENDPOINT;

  const requestBody = {
    token: token,
    newPassword: payload.newPassword
  };

  // apiClient が認証トークン（Cookie等）を自動付与して送信する想定
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
    return errorData;
  }

  const authData: SpringBootAuthResponse = await response.json();
  return authData;
};

/**
 * パスワード再設定処理を行う Server Action
 *
 * @param token - パスワード再設定用のワンタイムトークン
 * @param data - パスワード再設定用フォームから送信された入力値（`AuthResetPasswordFormValues`）
 * @returns 処理結果オブジェクト（`AuthResetPasswordResult`）
 *
 * @remarks
 * 処理手順:
 * 1. Zod スキーマ（`authResetPasswordSchema`）を用いた入力値バリデーションチェック
 * 2. Spring Boot 側のパスワード変更 API 呼び出し（`callResetPasswordApi`）
 * 3. 処理結果（成功 / 失敗フラグ、メッセージ）を呼出元へ返却
 */
export const authResetPasswordAction = async (
  token: string,
  data: AuthResetPasswordFormValues
): Promise<AuthResetPasswordResult> => {

  // 1. バリデーションチェック
  const parsed = authResetPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: AUTH_MESSAGES.VALIDATION_ERROR,
    };
  }

  try {
    // 2. Spring Boot API 呼び出し
    const apiResponse = await callResetPasswordApi(token, data);

    // エラーレスポンスの場合（status プロパティを持っているか判定）
    if ('status' in apiResponse) {
      return {
        success: false,
        message: apiResponse.message || 'パスワードの再設定に失敗しました',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Reset Password Action Error:', error);
    return {
      success: false,
      message: AUTH_MESSAGES.NETWORK_ERROR,
    };
  }
}
