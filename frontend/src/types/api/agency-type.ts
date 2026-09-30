/**
 * 代理店情報取得 API レスポンス (GET /api/agencies)
 */
export type AgencyInfoGetApiResponse = {
  /* 代理店コード(6桁) */
  agencyCode: string;
  /* 代理店名 */
  agencyName: string;
 
}