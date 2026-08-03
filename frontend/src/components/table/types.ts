/**
 * 営業案件データの基本モデル定義
 */
export type Deal = {
  // 案件ID
  id: string;
  // 顧客名
  client: string;
  // 予定金額
  amount: string;
  // ステータス
  status: string;
  // 担当者名
  owner: string;
}
