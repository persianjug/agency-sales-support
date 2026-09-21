'use server'

import { COMMON_MESSAGES } from '@/constants/messages';
import { apiClient } from '@/lib/api-Client';
import { revalidatePath } from 'next/cache';
import { profileUpdateFormSchema, ProfileUpdateFormValues } from '@/lib/validations/profile-schema';
import { ProfileGetApiResponse, ProfileUpdateApiRequest } from '@/types/api/profile-type';
import { ActionsResult, ErrorApiResponse, SuccessApiResponse } from '@/types/api/common-type';
import { createErrorApiResponse, createErrorResult, createSuccessResult } from '@/lib/actions-utils';


/**
 * フォーム入力値（ProfileUpdateFormValues）を API リクエスト DTO（ProfileUpdateApiRequest）に変換する関数
 * @param values - API へ送信するアカウント作成フォーム値（`ProfileUpdateFormValues`）
 */
const mapFormValuesToProfileUpdateApiRequest = (
  values: ProfileUpdateFormValues
): ProfileUpdateApiRequest => {
  return {
    avatarUrl: values.avatarUrl || undefined,
    phoneNumber: values.phoneNumber || undefined,
    certificationCodes: values.certifications.map(cert => cert.CertificationCode) || [],
    specialties: values.specialties.map(spec => ({
      specialtyCode: spec.specialtyCode,
      years: spec.years,
    })) || [],
    careerSummary: values.careerSummary || undefined,
    greetingMessage: values.greetingMessage || undefined,
  };
};


/**
 * Spring Boot のプロフィール取得 API を呼び出す内部ヘルパー関数
 *
 * @returns 成功時は `SpringBootUserProfileResponse`、失敗・エラー時は `SpringBootErrorResponse` を返却する Promise
 *
 * @remarks
 * - 通信完了後、ステータスコード（`response.ok`）で成功・失敗を判定します。
 * - HTTP エラー時、レスポンス JSON の解析に失敗した場合はフォールバックとしてデフォルトのエラーオブジェクトを生成します。
 */
const callGetProfileApi = async (): Promise<ProfileGetApiResponse | ErrorApiResponse> => {
  const endpoint = process.env.PROFILE_GET_API_ENDPOINT;

  const response = await apiClient.get(endpoint);

  if (!response.ok) {
    const errorData: ErrorApiResponse = await response
      .json()
      .catch(() => createErrorApiResponse(response.status));
    return errorData
  }

  const profileData: ProfileGetApiResponse = await response.json();
  return profileData;
}

/**
 * プロフィール情報を取得する Server Action
 * 
 * @returns 成功時は `SpringBootUserProfileResponse`、失敗・エラー時は `SpringBootErrorResponse` を返却する Promise
 */
export const getProfileAction = async (): Promise<ProfileGetApiResponse | ActionsResult> => {
  try {
    // プロフィール取得 API 呼び出し
    const apiResponse = await callGetProfileApi();

    // エラーレスポンスの場合（status プロパティを持っているか判定）
    if ('status' in apiResponse) {
      return createErrorResult(apiResponse.message);
    }

    // アカウント作成画面のキャッシュを更新
    revalidatePath('/profile');

    return apiResponse;
  } catch (error) {
    console.error('Get Profile Action Error:', error);
    return createErrorResult(COMMON_MESSAGES.NETWORK_ERROR);
  }
};



/**
 * プロフィール更新 API を呼び出す内部ヘルパー関数
 *
 * @param payload - API へ送信するプロフィール更新フォーム値（`ProfileUpdateFormValues`）
 * @returns 成功時は `SuccessApiResponse`、失敗・エラー時は `ErrorApiResponse` を返却する Promise
 */
const callProfileUpdateApi = async (
  payload: ProfileUpdateFormValues
): Promise<SuccessApiResponse | ErrorApiResponse> => {
  const endpoint = process.env.PROFILE_UPDATE_API_ENDPOINT;
  const response = await  apiClient.post(endpoint, payload);

  if (!response.ok) {
    const errorData: ErrorApiResponse = await response
      .json()
      .catch(() => createErrorApiResponse(response.status));
    return errorData;
  }

  const successData: SuccessApiResponse = await response.json();
  return successData;
};

/**
 * プロフィール情報を更新する Server Action
 * @param data - プロフィール編集フォームから送信された入力値（`ProfileUpdateFormValues`）
 * @returns 処理結果オブジェクト（`ActionsResult`）
 *
 * @remarks
 * 処理手順:
 * 1. Zod スキーマ（`profileUpdateSchema`）を用いた入力値バリデーションチェック
 * 2. プロフィール更新 API 呼び出し（`callProfileUpdateApi`）
 * 3. 処理結果（成功 / 失敗フラグ、メッセージ）を呼出元へ返却
*/
export const updateProfileAction = async (
  data: ProfileUpdateFormValues
): Promise<ActionsResult> => {
  // 1. バリデーションチェック
  const parsed = profileUpdateFormSchema.safeParse(data);
  if (!parsed.success) {
    return createErrorResult(COMMON_MESSAGES.VALIDATION_ERROR);
  }

  try {
    // 3. プロフィール更新 API 呼び出し
    const apiResponse = await callProfileUpdateApi(data);

    // エラーレスポンスの場合（status プロパティを持っているか判定）
    if ('status' in apiResponse) {
      return createErrorResult(apiResponse.message);
    }

    // マイページとプロフィール編集画面のキャッシュを更新
    revalidatePath('/profile');
    revalidatePath('/profile/edit');

    return createSuccessResult('プロフィールの更新に成功しました');
  } catch (error) {
    console.error('Update Profile Action Error:', error);
    return createErrorResult(COMMON_MESSAGES.NETWORK_ERROR);
  }
};