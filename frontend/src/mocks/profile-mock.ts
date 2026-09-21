import { ProfileGetApiResponse } from "@/types/api/profile-type";

/**
 * サーバー側でプロフィール取得する非同期関数。
 * （※実際の運用では DB 接続や外部 REST API から取得する処理に置き換えます）
 *
 * @returns プロフィール情報を返す Promise
 */
export const getProfile = async (): Promise<ProfileGetApiResponse> => {
  return {
    "lastName": "山田",
    "firstName": "太郎",
    "lastNameKana": "ヤマダ",
    "firstNameKana": "タロウ",
    "role": "ROLE_SOLICITOR",
    "agencyName": "株式会社 ほけんのみどり窓口",
    "agencyCode": "A12345",
    "solicitorCode": "987645",
    "solicitorRegistrationNumber": "DMY000012345",
    "email": "abc@abc.com",
    "avatarUrl": "https://storage.example.com/avatars/101.jpg",
    "phoneNumber": "090-1234-5678",
    "greetingMessage": "お客様一人ひとりに合わせた最適なプランをご提案いたします。",
    "careerSummary": "生命保険営業10年。法人税務を中心に担当。",
    "certifications": [
      {
        "certificationCode": "000010",
        "name": "FP技能士2級（生命保険コース）"
      }
    ],
    "specialties": [
      {
        "specialtyCode": "0000001",
        "name": "法人税務",
        "years": 1
      }
    ]
  }
};