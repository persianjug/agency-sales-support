'use server'

import { COMMON_MESSAGES } from '@/constants/messages';
import { apiClient } from '@/lib/api-Client';
import { ActionsResult, ErrorApiResponse } from '@/types/api/common-type';
import { createErrorApiResponse, createErrorResult } from '@/lib/actions-utils';
import { AgencyInfoGetApiResponse } from "@/types/api/agency-type";
import { MOCK_AGENCIES } from './agency-mock-data';

/**
 * 代理店コードから代理店名を取得するモック関数
 * （Server Actions または API呼び出しのダミー）
 */
const getAgencyInfoMock = async (agencyCode: string): Promise<AgencyInfoGetApiResponse | null> => {
  // 擬似的なAPI通信遅延（3 00ms）
  await new Promise((resolve) => setTimeout(resolve, 300));

  const agency = MOCK_AGENCIES.find((a) => a.agencyCode === agencyCode);
  return agency ?? null;
};

/**
 * 代理店情報取得 API を呼び出す内部ヘルパー関数
 *
 * @param agencyCode -取得する代理店情報の代理店コード
 * @returns 成功時は `AgencyInfoGetApiResponse`、失敗・エラー時は `ErrorApiResponse` を返却する Promise
 *
 * @remarks
 * - 通信完了後、ステータスコード（`response.ok`）で成功・失敗を判定します。
 * - HTTP エラー時、レスポンス JSON の解析に失敗した場合はフォールバックとしてデフォルトのエラーオブジェクトを生成します。
 */
const callAgencyInfoGetApi = async (agencyCode: string): Promise<AgencyInfoGetApiResponse | ErrorApiResponse> => {
  const endpoint = process.env.AGENCY_INFO_GET_API_ENDPOINT;

  const response = await apiClient.get(endpoint);

  if (!response.ok) {
    const errorData: ErrorApiResponse = await response
      .json()
      .catch(() => createErrorApiResponse(response.status));
    return errorData
  }

  const agencyInfoData: AgencyInfoGetApiResponse = await response.json();
  return agencyInfoData;
}

/**
 * 代理店情報を取得する Server Action
 * 
 * @param agencyCode -取得する代理店情報の代理店コード
 * @returns 成功時は `AgencyInfoGetApiResponse`、失敗・エラー時は `ActionsResult` を返却する Promise
 */
export const getAgencyInfoAction = async (agencyCode: string): Promise<AgencyInfoGetApiResponse | ActionsResult> => {
  try {
    // 代理店情報取得 API 呼び出し
    // const apiResponse = await callAgencyInfoGetApi(agencyCode);
    const apiResponse = await getAgencyInfoMock(agencyCode);

    // エラーレスポンスの場合（status プロパティを持っているか判定）
    if ('status' in apiResponse) {
      return createErrorResult(apiResponse.message);
    }

    return apiResponse;
  } catch (error) {
    console.error('Agency Info Get Action Error:', error);
    return createErrorResult(COMMON_MESSAGES.NETWORK_ERROR);
  }
};



