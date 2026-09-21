/**
 * 役割・権限の選択肢定義（BackEndの Role.java に準拠）
 */
export const ROLE_OPTIONS = [
  { value: "ROLE_SOLICITOR", label: "0001: 募集人" },
  { value: "ROLE_AGENCY_ADMIN", label: "0002: 代理店管理者" },
  { value: "ROLE_HQ_STAFF", label: "0003: 本部スタッフ" },
  { value: "ROLE_SYSTEM_ADMIN", label: "0004: システム管理者" },
] as const;
