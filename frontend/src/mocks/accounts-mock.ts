import { AccountListGetResponse, AccountListItem } from "@/types/api/account-type";

/**
 * サーバー側でプロフィール取得する非同期関数。
 * （※実際の運用では DB 接続や外部 REST API から取得する処理に置き換えます）
 *
 * @returns アカウント情報一覧を返す Promise
 */
export const getAccounts = async (): Promise<AccountListGetResponse> => {
  const lastNames = ["山田", "鈴木", "佐藤", "田中", "高橋", "渡辺", "伊藤", "中村", "小林", "加藤"];
  const lastNamesKana = ["ヤマダ", "スズキ", "サトウ", "タナカ", "タカハシ", "ワタナベ", "イトウ", "ナカムラ", "コバヤシ", "カトウ"];

  const firstNames = ["太郎", "次郎", "健一", "美咲", "花子", "直樹", "裕子", "拓也", "麻衣", "誠"];
  const firstNamesKana = ["タロウ", "ジロウ", "ケンイチ", "ミサキ", "ハナコ", "ナオキ", "ユウコ", "タクヤ", "マイ", "マコト"];

  const roles: ("ROLE_SYSTEM_ADMIN" | "ROLE_AGENCY_ADMIN" | "ROLE_SOLICITOR")[] = [
    "ROLE_SYSTEM_ADMIN",
    "ROLE_AGENCY_ADMIN",
    "ROLE_SOLICITOR",
  ];

  const statuses: ("ACTIVE" | "SUSPENDED" | "LOCKED")[] = [
    "ACTIVE",
    "SUSPENDED",
    "LOCKED",
  ];

  const agencies = [
    "株式会社 みどりぐちシステム",
    "代理店の保険 株式会社",
    "株式会社 ほけんのさかぐち",
    "東京アライアンス株式会社",
    "横浜ライフサービス有限会社",
  ];

  const items: AccountListItem[] = Array.from({ length: 100 }, (_, index) => {
    const id = index + 1;
    const lastNameIdx = index % lastNames.length;
    const firstNameIdx = (index + Math.floor(index / 10)) % firstNames.length;

    return {
      id: id,
      username: `user${id}@example.com`,
      role: roles[index % roles.length],
      status: statuses[index % statuses.length],
      lastName: lastNames[lastNameIdx],
      firstName: `${firstNames[firstNameIdx]}${id > 10 ? id : ""}`,
      lastNameKana: lastNamesKana[lastNameIdx],
      firstNameKana: `${firstNamesKana[firstNameIdx]}${id > 10 ? id : ""}`,
      agencyName: agencies[index % agencies.length],
    };
  });

  return {
    items: items,
    totalCount: items.length,
  };
};


// import { AccountListGetResponse, AccountListItem } from "@/types/api/account-type";

// /**
//  * サーバー側でプロフィール取得する非同期関数。
//  * （※実際の運用では DB 接続や外部 REST API から取得する処理に置き換えます）
//  *
//  * @returns アカウント情報一覧を返す Promise
//  */
// export const getAccounts = async (): Promise<AccountListGetResponse> => {
//   const items: AccountListItem[] = [
//     {
//       id: 1,
//       username: "abc@ddc.com",
//       role: "ROLE_SYSTEM_ADMIN",
//       status: "ACTIVE",
//       lastName: "山田",
//       firstName: "太郎",
//       lastNameKana: "ヤマダ",
//       firstNameKana: "タロウ",
//       agencyName: "株式会社 みどりぐちシステム"
//     },
//     {
//       id: 2,
//       username: "bbc@abc.com",
//       role: "ROLE_SOLICITOR",
//       status: "LOCKED",
//       lastName: "魚",
//       firstName: "綾子",
//       lastNameKana: "サカナ",
//       firstNameKana: "アヤコ",
//       agencyName: "代理店の保険　株式会社"
//     },
//     {
//       id: 3,
//       username: "abd@abc.com",
//       role: "ROLE_SYSTEM_ADMIN",
//       status: "SUSPENDED",
//       lastName: "山田",
//       firstName: "太郎３",
//       lastNameKana: "ヤマダ",
//       firstNameKana: "タロウ３",
//       agencyName: "株式会社 ほけんのさかぐち"
//     },
//   ]

//   return {
//     items: items,
//     totalCount: 1,
//   }
// };
