import { Certification, Specialty } from "@/types/api/common-type";


/** 資格マスタの選択肢候補 */
const CERT_MASTER: Certification[] = [
  { certificationCode: 1, name: "FP技能士1級（生命保険コース）" },
  { certificationCode: 2, name: "FP技能士2級（生命保険コース）" },
  { certificationCode: 3, name: "専門課程試験" },
  { certificationCode: 4, name: "変額保険販売資格" },
  { certificationCode: 5, name: "損害保険専門シニア" },
  { certificationCode: 6, name: "住宅ローンアドバイザー" },
  { certificationCode: 7, name: "生命保険支払査定士" },
  { certificationCode: 8, name: "シニアライフコンサルタント" },
] as const;

/** 得意分野マスタの選択肢候補 */
const SPECIALTY_MASTER: Specialty[] = [
  { specialtyCode: 1, name: "法人税務" },
  { specialtyCode: 2, name: "事業承継" },
  { specialtyCode: 3, name: "リスクマネジメント" },
  { specialtyCode: 4, name: "資産運用" },
  { specialtyCode: 5, name: "リテール営業" },
  { specialtyCode: 6, name: "ドクターマーケット"},
] as const;


/**
 * サーバー側でプロフィール取得する非同期関数。
 * （※実際の運用では DB 接続や外部 REST API から取得する処理に置き換えます）
 *
 * @returns 得意分野情報を返す Promise
 */
export const getSpecialties = async (): Promise<Specialty[]> => {
  return SPECIALTY_MASTER;
};

/**
 * サーバー側でプロフィール取得する非同期関数。
 * （※実際の運用では DB 接続や外部 REST API から取得する処理に置き換えます）
 *
 * @returns 保有資格情報を返す Promise
 */
export const getCertifications = async (): Promise<Certification[]> => {
  return CERT_MASTER;
};