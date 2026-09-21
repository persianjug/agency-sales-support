import { ActionsResult, ErrorApiResponse } from '@/types/api/common-type';
import { COMMON_MESSAGES } from '@/constants/messages';

/**
 * Server Action の成功レスポンスを生成するヘルパー関数
 * @param message - 成功メッセージ
 * @param errors - 成功レスポンスオブジェクト
 * @returns 処理結果オブジェクト（`ActionsResult`）
 */
export const createSuccessResult = (
  message?: string,
  data?: Record<string, unknown>
): ActionsResult => {
  return {
    success: true,
    message: message || COMMON_MESSAGES.SUCCESS,
    ...data,
  };
};

/**
 * Server Action の失敗・エラーレスポンスを生成するヘルパー関数
 * @param message - エラーメッセージ
 * @param errors - エラーレスポンスオブジェクト
 * @returns 処理結果オブジェクト（`ActionsResult`）
 */
export const createErrorResult = (
  message?: string,
  errors?: Record<string, string[]>
): ActionsResult => {
  return {
    success: false,
    message: message || COMMON_MESSAGES.SERVER_ERROR,
    ...(errors && { errors }),
  };
};

/**
 * Server Action の失敗・エラーレスポンスを生成するヘルパー関数
 * @param status - ステータスコード
 * @returns 処理結果オブジェクト（`ErrorApiResponse`）
 */
export const createErrorApiResponse = (
  status: number,
): ErrorApiResponse => {
  return {
    timestamp: '',
    status: status,
    error: 'UNKNOWN_ERROR',
    message: COMMON_MESSAGES.SERVER_ERROR,
  };
};