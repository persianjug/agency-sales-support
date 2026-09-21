import { RoleType } from "@/constants/role";

/**
 * 得意分野情報の送信用リクエスト構造
 */
export type SpecialtyApiRequest = {
  /** 得意分野分野ID */
  specialtyCode: number;
  /** 経験年数 */
  years: number;
};

/**
 * アカウント作成 API リクエスト DTO (Data Transfer Object)
 *
 * @remarks
 * POST /api/v1/accounts などのリクエストボディとして送信されるデータ型です。
 */
export type AccountCreateApiRequest = {
  // -----------------------------------------------------------------
  // 1. アカウント認証・権限情報 (accounts テーブルに対応)
  // -----------------------------------------------------------------
  /** ログインID（メールアドレス） */
  email: string;

  /** 初期パスワード（自動生成の場合は undefined または null） */
  password?: string;

  /** 初期パスワードの生成方式 ("auto" | "manual") */
  passwordType: "auto" | "manual";

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

  /** 保有資格IDリスト */
  certificationCodes?: number[];

  /** 得意分野リスト */
  specialties?: SpecialtyApiRequest[];

  /** 業務経歴・強みサマリ */
  careerSummary?: string;

  /** ご挨拶メッセージ */
  greetingMessage?: string;
};


/**
 * 一覧表示用のアカウント項目（必要最小限）
 */
export type AccountListItem = {
  /** アカウントID (accounts.id) */
  id: number,
  /** ログインID/メールアドレス (accounts.username) */
  username: string
  /** システム権限 (accounts.role) */
  role: "ROLE_SYSTEM_ADMIN" | "ROLE_AGENCY_ADMIN" | "ROLE_SOLICITOR"
  /** アカウント状態 (accounts.status) */
  status: "ACTIVE" | "SUSPENDED" | "LOCKED"
  /** 姓（漢字） (user_profiles.last_name) */
  lastName: string
  /** 名（漢字） (user_profiles.first_name) */
  firstName: string
  /** セイ（フリガナ） (user_profiles.last_name_kana) */
  lastNameKana: string
  /** メイ（フリガナ） (user_profiles.first_name_kana) */
  firstNameKana: string
  /** 所属代理店名称 (agencies.agency_name) */
  agencyName: string
}

/**
 * アカウント一覧データ取得 API レスポンス (GET /api/accounts)
 */
export type AccountListGetResponse = {
  /** アカウント一覧 */
  items: AccountListItem[]
  /** ページネーション用総件数 */
  totalCount: number
}

