'use server'

import { COMMON_MESSAGES } from '@/constants/messages';
import { apiClient } from '@/lib/api-Client';
import { revalidatePath } from 'next/cache';
import { ActionsResult, ErrorApiResponse, SuccessApiResponse } from '@/types/api/common-type';
import { AccountCreateFormValues, accountCreateSchema } from '@/lib/validations/account-schema';
import { AccountCreateApiRequest } from '@/types/api/account-type';
import { createErrorApiResponse, createErrorResult, createSuccessResult } from '@/lib/actions-utils';

/**
 * フォーム入力値（AccountCreateFormValues）を API リクエスト DTO（AccountCreateApiRequest）に変換する関数
 * @param values - API へ送信するアカウント作成フォーム値（`AccountCreateFormValues`）
 */
const mapFormValuesToAccountCreateApiRequest = (
  values: AccountCreateFormValues
): AccountCreateApiRequest => {
  return {
    email: values.email,
    passwordType: values.passwordType,
    password: values.passwordType === 'manual' ? values.password : undefined,
    role: values.role,

    lastName: values.lastName,
    firstName: values.firstName,
    lastNameKana: values.lastNameKana,
    firstNameKana: values.firstNameKana,

    agencyCode: values.agencyCode,
    solicitorCode: values.solicitorCode,
    solicitorRegistrationNumber: values.solicitorRegistrationNumber,

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
 * アカウント作成 API を呼び出す内部ヘルパー関数
 *
 * @param payload - API へ送信するアカウント作成フォーム値（`AccountCreateFormValues`）
 * @returns 成功時は `SuccessApiResponse`、失敗・エラー時は `ErrorApiResponse` を返却する Promise
 */
const callAccountCreateApi = async (
  payload: AccountCreateFormValues
): Promise<SuccessApiResponse | ErrorApiResponse> => {
  const endpoint = process.env.ACCOUNT_CREATE_API_ENDPOINT;
  const response = await apiClient.post(endpoint, payload);

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
 * アカウント作成する Server Action
 * @param data - プロフィール編集フォームから送信された入力値（`AccountCreateFormValues`）
 * @returns 処理結果オブジェクト（`ActionsResult`）
 *
 * @remarks
 * 処理手順:
 * 1. Zod スキーマ（`AccountCreateSchema`）を用いた入力値バリデーションチェック
 * 2. アカウント作成 API 呼び出し（`callCreateAccountApi`）
 * 3. 処理結果（成功 / 失敗フラグ、メッセージ）を呼出元へ返却
*/
export const createAccountAction = async (
  data: AccountCreateFormValues
): Promise<ActionsResult> => {
  // 1. バリデーションチェック
  const parsed = accountCreateSchema.safeParse(data);
  if (!parsed.success) {
    return createErrorResult(COMMON_MESSAGES.VALIDATION_ERROR);
  }

  try {
    // 2. フォーム値を API 用 DTO 構造へ変換
    const requestPayload = mapFormValuesToAccountCreateApiRequest(parsed.data);

    // 3. アカウント作成 API 呼び出し
    const apiResponse = await callAccountCreateApi(requestPayload);

    // エラーレスポンスの場合（status プロパティを持っているか判定）
    if ('status' in apiResponse) {
      return createErrorResult(apiResponse.message);
    }

    // 4. アカウント作成画面のキャッシュを更新
    revalidatePath('/account');

    return createSuccessResult('アカウントの作成に成功しました');
  } catch (error) {
    console.error('Create Account Action Error:', error);
    return createErrorResult(COMMON_MESSAGES.NETWORK_ERROR);
  }
};