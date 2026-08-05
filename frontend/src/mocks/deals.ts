import { Deal } from "@/components/table/types";

/**
 * サーバー側で営業案件リストを取得する非同期関数。
 * （※実際の運用では DB 接続や外部 REST API から取得する処理に置き換えます）
 *
 * @returns 営業案件データの配列を返す Promise
 */
export const getDeals = async (): Promise<Deal[]> => {
  // await new Promise((resolve) => setTimeout(resolve, 100));

  return [
    {
      id: "D-001",
      client: "株式会社横浜テクノロジー",
      amount: "¥1,200,000",
      status: "交渉中",
      owner: "佐藤",
    },
    {
      id: "D-002",
      client: "湘南イノベーションズ",
      amount: "¥850,000",
      status: "内定",
      owner: "田中",
    },
    {
      id: "D-003",
      client: "戸塚システムソリューションズ",
      amount: "¥3,400,000",
      status: "提案中",
      owner: "鈴木",
    },
    {
      id: "D-004",
      client: "みなとみらいクリエイティブ",
      amount: "¥500,000",
      status: "完了",
      owner: "高橋",
    },
  ];
};