import { RoleType } from "@/constants/role-constant";
import { SpecialtyApiRequest } from "./account-type";

/**
 * 資格情報のレスポンス構造
 */
export type CertificationApiResponse = {
  /** 資格識別コード */
  certificationCode: string;
  /** 資格名称 */
  name: string;
};

/**
 * 得意分野情報のレスポンス構造
 */
export type SpecialtyApiResponse = {
  /** 得意分野識別コード */
  specialtyCode: string;
  /** 得意分野名称 */
  name: string;
  /** 経験年数 */
  years: number;
};

/**
 * プロフィール取得 API レスポンス DTO
 */
export type ProfileGetApiResponse = {
  // -----------------------------------------------------------------
  // 1. アカウント認証・権限情報 (accounts テーブルに対応)
  // -----------------------------------------------------------------
  /** ログインID（メールアドレス） */
  email: string;

  /** システム権限 (例: "ROLE_USER", "ROLE_SOLICITOR" 等) */
  role: RoleType;

  // -----------------------------------------------------------------
  // 2. 募集人・基本プロフィール情報 (user_profiles テーブルに対応)
  // -----------------------------------------------------------------
  /** 姓（漢字） */
  lastName: string;

  /** 名（漢字） */
  firstName: string;

  /** 姓（フリガナ） */
  lastNameKana: string;

  /** 名（フリガナ） */
  firstNameKana: string;

  /** 代理店コード（6桁） */
  agencyCode: string;

  /** 代理店名 */
  agencyName: string;

  /** 募集人コード（6桁） */
  solicitorCode: string;

  /** 募集人登録番号（13桁） */
  solicitorRegistrationNumber: string;

  // -----------------------------------------------------------------
  // 3. 連絡先・営業属性 (user_profiles / 関連テーブルに対応)
  // -----------------------------------------------------------------
  /** アバター画像URL */
  avatarUrl?: string;

  /** 営業用電話番号 */
  phoneNumber?: string;

  /** 保有資格情報 */
  certifications?: CertificationApiResponse[];

  /** 得意分野リスト */
  specialties?: SpecialtyApiResponse[];

  /** 業務経歴・強みサマリ */
  careerSummary?: string;

  /** ご挨拶メッセージ */
  greetingMessage?: string;
};

/**
 * プロフィール更新 API リクエスト DTO
 */
export type ProfileUpdateApiRequest = {
  // -----------------------------------------------------------------
  // 1. 連絡先・営業属性 (user_profiles / 関連テーブルに対応)
  // -----------------------------------------------------------------
  /** アバター画像URL */
  avatarUrl?: string;

  /** 営業用電話番号 */
  phoneNumber?: string;

  /** 保有資格IDリスト */
  certificationCodes?: number[];

  /** 得意分野リスト */
  specialties?: SpecialtyApiRequest[];

  /** 業務経歴・強みサマリ */
  careerSummary?: string;

  /** ご挨拶メッセージ */
  greetingMessage?: string;
};
